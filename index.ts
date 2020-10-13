import generator, { Entity, Response, WebSocketInterface } from 'megalodon'
import * as dotenv from 'dotenv'
import axios from 'axios'
import * as mysql from 'mysql'
import { CONFIG, HIMARUN_MAP } from './interfaces/common'
import knex from 'knex'

dotenv.config()
const config = (process.env as unknown) as CONFIG
const dbConfig = {
	host: config.DB_HOST,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_DATABASE,
}
const pool = mysql.createPool(dbConfig)

const my = knex({ client: 'mysql' })
const BASE_URL: string = config.DOMAIN
const access_token: string = config.TOKEN
const client = generator('mastodon', 'wss://' + BASE_URL, access_token)

function main() {
	let stream: WebSocketInterface
	if (isTrue(config.USE_HTL)) {
		stream = client.userSocket()
	} else {
		stream = client.localSocket()
	}

	stream.on('connect', () => {
		console.log('Connect the streaming')
	})

	stream.on('update', (status: Entity.Status) => {
		const acct = status.account.acct
		const url = status.url
		const createdAt = new Date(status.created_at)
		const statusCreatedAt = genMysqlTimestamp(createdAt)
		const sql = my(config.DB_TABLE)
			.insert({
				Acct: acct,
				Url: url,
				StatusCreatedAt: statusCreatedAt,
				Date: `${createdAt.getFullYear()}-${to2Str(createdAt.getMonth() + 1)}-${to2Str(createdAt.getDate())}`,
			})
			.toString()
		pool.query(sql, (error, results) => {
			if (error) console.error(error)
		})
	})

	//Only USE_HTL true, auto follow on local account
	stream.on('notification', async (notification: Entity.Notification) => {
		if (!isTrue(config.AUTOFOLLOW)) return false
		if (notification.type !== 'follow') return false
		//equal means local account because remote account return with domain as acct, but not as username
		if (notification.account.acct == notification.account.username) return false
		await axios.post(`https://${BASE_URL}/api/v1/accounts/${notification.account.id}/follow`, { headers: { Authorization: `Bearer ${access_token}` } })
	})

	stream.on('close', () => {
		main()
	})
}
function himarun() {
	const date = new Date()
	const get = my(config.DB_TABLE)
		.select('Acct')
		.where('Date', `${date.getFullYear()}-${to2Str(date.getMonth() + 1)}-${to2Str(date.getDate())}`)
		.toString()
	pool.query(get, (error, results: { Acct: string }[]) => {
		if (error) console.error(error)
		const map: HIMARUN_MAP = {}
		let ct = 1
		for (const data of results) {
			ct++
			map[data.Acct] ? (map[data.Acct] = map[data.Acct] + 1) : (map[data.Acct] = 1)
		}
		const keys = Object.keys(map)
		const arr: { acct: string; count: number }[] = []
		for (let i = 0; i < ct; i++) {
			if (!keys[i]) break
			arr.push({
				acct: keys[i],
				count: map[keys[i]],
			})
		}
		arr.sort(function (a, b) {
			if (a.count > b.count) return -1
			if (a.count < b.count) return 1
			return 0
		})
		let post = ''
		let i = 0
		let rank = 1
		for (const data of arr) {
			const old = i != 0 ? arr[i - 1].count : ''
			if (old != arr[i].count) {
				rank = i + 1
			}
			post =
				post +
				`
${rank}:${data.acct}(${data.count})`
			i++
		}
		console.log(post)
		client.postStatus(post).then((res: Response<Entity.Status>) => {
			console.log(res.data)
		})
	})
}
main()
function getAcct(acct: { Acct: string }) {
	return acct.Acct
}
const watcher = function () {
	const date = new Date()
	if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
		console.log('0:00:00')
		himarun()
	}
}
setInterval(watcher, 1000)
function isTrue(target: string) {
	if (target === '1' || target === 'true' || target === 'TRUE' || target === 'True' || target === 'On' || target === 'ON' || target === 'on') return true
	return false
}
function genMysqlTimestamp(date: Date) {
	return `${date.getFullYear()}-${to2Str(date.getMonth() + 1)}-${to2Str(date.getDate())} ${to2Str(date.getHours())}:${to2Str(date.getMinutes())}:${to2Str(date.getSeconds())}`
}
function to2Str(str: number) {
	if (str < 10) return '0' + str
	return str
}
