const express = require('express');
const mysql = require('mysql');
const { dbConfig } = require('./db.config')
const app = express();

let connection = null;
const getConnection = () => new Promise((resolve, reject) => {
	if (connection) {
		resolve(connection);
		return;
	}

	connection = mysql.createConnection(dbConfig);
	connection.connect((erro) => {
		if (erro) {
			console.log(erro);
			connection = null;
			reject(erro);
			return;
		}

		console.log('Connected to database');
		resolve(connection);
	});
})

const disconnect = () => new Promise((resolve, reject) => {
	if (connection) {
		connection.end((err) => {
			if (err) {
				reject(err);
				return;
			}

			connection = null;
			resolve();
		});
	}

	resolve();
})

const runQuery = (sql) => new Promise(async (resolve, reject) => {
	const connection = await getConnection();
	connection.query({
		sql,
	}, (err, results) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(results);
	})
})

const insertUser = async (name) => {
	return runQuery(`INSERT INTO people (name) VALUES ('${name}')`);
}

const listUsers = async () => {
	return runQuery('SELECT * FROM people');
}

app.get("/", async (req, res) => {
	try {
		const randomNumber = Math.ceil(Math.random() * 100);
		const name = `John-random-#${randomNumber}`;

		await insertUser(name);

		const users = await listUsers();

		disconnect();
		const html = `
			<p>
				<p><h1>Full Cycle Rocks!</h1></p>
			</p>
			<p>
				<p> - Lista de nomes cadastrada no banco de dados:</p>
				<table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Nome</th>
						</tr>
					</thead>
					<tbody>
					${users.map(u => `
						<tr>
							<td>${u.id}</td>
							<td>${u.name}</td>		
						</tr>
					`).join('')}
					</tbody>
				</table>
			</p>
		`;

		return res.header('Content-Type', 'text/html').send(html);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
});

app.listen(3000, () => {
	console.log('Server running at port 3000 🚀');
})