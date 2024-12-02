const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// ************************************
// ************************************
// *****   BANDO DE DADOS     *********
// ************************************
// ************************************

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database("agendamento.db");

// Criar as tabelas se não existirem
db.serialize(() => {
    // Tabela Cliente
    db.run(
        `
        CREATE TABLE IF NOT EXISTS Cliente (
            id integer PRIMARY key autoincrement, 
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT,
            email TEXT NOT NULL
        )
    `,
        (err) => {
            if (err) {
                console.error("Erro ao criar tabela Cliente:", err);
            } else {
                console.log(
                    "Tabela Cliente criada com sucesso (ou já existe).",
                );
            }
        },
    );
    //consulta serviço
    db.run(
        `
        CREATE TABLE IF NOT EXISTS Servico (
            id integer PRIMARY key autoincrement, 
            nome TEXT NOT NULL,
            valor TEXT  NOT NULL

        )
    `,
        (err) => {
            if (err) {
                console.error("Erro ao criar tabela servico:", err);
            } else {
                console.log(
                    "Tabela servico criada com sucesso (ou já existe).",
                );
            }
        },
    );

    //consulta profissional
    db.run(
        `
        CREATE TABLE IF NOT EXISTS profissional (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            telefone TEXT NOT NULL,
            data_nascimento TEXT NOT NULL,
            endereco TEXT NOT NULL,
            email TEXT NOT NULL
        )
    `,
        (err) => {
            if (err) {
                console.error("Erro ao criar tabela Profissional:", err);
            } else {
                console.log(
                    "Tabela Profissional criada com sucesso (ou já existe).",
                );
            }
        },
    );

    // Tabela Agenda
    db.run(
        `
        CREATE TABLE IF NOT EXISTS Agenda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            horario TEXT NOT NULL,
            sala TEXT NOT NULL,
            cpf_cliente TEXT NOT NULL,
            cpf_profissional TEXT NOT NULL,
            FOREIGN KEY(cpf_cliente) REFERENCES Cliente(cpf),
            FOREIGN KEY(cpf_profissional) REFERENCES Profissional(cpf)
        )
    `,
        (err) => {
            if (err) {
                console.error("Erro ao criar tabela Agenda:", err);
            } else {
                console.log("Tabela Agenda criada com sucesso (ou já existe).");
            }
        },
    );
});


// ************************************
// ************************************
// *****       SERVIÇOS       *********
// ************************************
// ************************************

// Rota para cadastrar um servico
app.post('/cadastrar-servico', (req, res) => {
    const { nome_s, preco_s, descricao_s } = req.body;
    db.run("INSERT INTO Servico (nome, valor) VALUES (?, ?)", [nome_s, preco_s], function (err) {
        if (err) {
            console.error('Erro ao cadastrar serviço:', err);
            res.status(500).send('Erro ao cadastrar serviço');
        } else {
            res.send('Serviço cadastrado com sucesso!');
        }
    });
});

// ************************************
// ************************************
// *****      PROFISSIONAL    *********
// ************************************
// ************************************

// Rota para cadastrar um profissional
// ROTA PRA CADASTRAR UM FUNCIONÁRIO
app.post('/cadastrar-funcionario', (req, res) => {
    const { nome_f, email_f, tel_f, cpf_f, data_f } = req.body;
    db.run("INSERT INTO profissional (nome, email, telefone, cpf, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?, 00)", [nome_f, email_f, tel_f, cpf_f, data_f], function (err) {
        if (err) {
            console.error('Erro ao cadastrar funcionário:', err);
            res.status(500).send('Erro ao cadastrar funcionário');
        } else {
            res.send('Funcionário cadastrado com sucesso!');
        }
    });
});
// ROTA PRA BUSCAR UM FUNCIONÁRIO PARA SER CARREGADO NO FRONT
app.get('/buscar-funcionario', (req, res) => {
    const { cpf } = req.query;

    db.get('SELECT * FROM profissional WHERE cpf = ?', [cpf], (err, row) => {
        if (err) {
            console.error('Erro ao buscar funcionário:', err);
            res.status(500).send('Erro ao buscar funcionário.');
        } else {
            res.json(row || null); // Retorna o funcionário encontrado ou null
        }
    });
});
// ROTA PRA ATUALIZAR UM FUNCIONÁRIO
app.put('/atualizar-funcionario', (req, res) => {
    const { nome, email, telefone, data, cpf } = req.body;

    db.run(
        'UPDATE profissional SET nome = ?, email = ?, telefone = ?, data_nascimento, WHERE cpf = ?',
        [nome, email, telefone, data, cpf],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar funcionário:', err);
                res.status(500).send('Erro ao atualizar funcionário.');
            } else if (this.changes === 0) {
                res.status(404).send('Funcionário não encontrado.');
            } else {
                res.send('Funcionário atualizado com sucesso!');
            }
        }
    );
});

// ************************************
// ************************************
// *****        CLIENTES      *********
// ************************************
// ************************************


// ROTA PRA CADASTRAR UM CLIENTE
app.post('/cadastrar-cliente', (req, res) => {
    const { nome_c, cpf_c, telefone_c, endereco_c } = req.body;
    db.run("INSERT INTO Cliente (nome, cpf, telefone, email) VALUES (?, ?, ?, ?)", 
        [nome_c, cpf_c, telefone_c, endereco_c], function (err) {
        if (err) {
            console.error('Erro ao cadastrar cliente:', err);
            res.status(500).send('Erro ao cadastrar cliente');
        } else {
            res.send('Cliente cadastrado com sucesso!');
        }
    });
});
// ROTA PRA BUSCAR UM CLIENTE PARA SER CARREGADO NO FRONT
app.get('/buscar-cliente', (req, res) => {
    const { cpf } = req.query;

    db.get('SELECT * FROM Cliente WHERE cpf = ?', [cpf], (err, row) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            res.status(500).send('Erro ao buscar cliente.');
        } else {
            res.json(row || null); // Retorna o cliente encontrado ou null
        }
    });
});
// ROTA PRA ATUALIZAR CADASTRO DO CLIENTE
app.put('/atualizar-cliente', (req, res) => {
    const { nome, cpf, telefone, endereco } = req.body;

    db.run(
        'UPDATE Cliente SET nome = ?, telefone = ?, email = ? WHERE cpf = ?',
        [nome, telefone, endereco, cpf],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar cliente:', err);
                res.status(500).send('Erro ao atualizar cliente.');
            } else if (this.changes === 0) {
                res.status(404).send('Cliente não encontrado.');
            } else {
                res.send('Cliente atualizado com sucesso!');
            }
        }
    );
});


// ************************************
// ************************************
// *****      AGENDAMENTO     *********
// ************************************
// ************************************
// Rota para cadastrar um agendamento


app.get('/buscar-servicos', (req, res) => {
    db.all("SELECT id, nome, valor FROM Servico", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            res.status(500).send('Erro ao buscar serviços');
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});

// ROTA PARA BUSCAR TODOS OS SERVIÇOS NO ATENDAMENTO
app.get('/buscar-profissionais', (req, res) => {
    db.all("SELECT cpf, nome FROM profissional", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            res.status(500).send('Erro ao buscar serviços');
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});

// ROTA PARA BUSCAR HORÁRIOS DISPONÍVEIS
app.get('/horarios-disponiveis', (req, res) => {
    const { data, idServico } = req.query;

    // Todos os horários possíveis
    const todosHorarios = [
        '08:00', '09:00', '10:00', '11:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    db.all(
        "SELECT horario FROM Agenda WHERE data = ? AND cpf_profissional = ?",
        [data, idServico],
        (err, rows) => {
            if (err) {
                console.error('Erro ao buscar horários ocupados:', err);
                res.status(500).send('Erro ao buscar horários ocupados');
            } else {
                // Extrai apenas os horários ocupados
                const horariosOcupados = rows.map(row => row.horario);

                // Filtra horários disponíveis
                const horariosDisponiveis = todosHorarios.filter(
                    horario => !horariosOcupados.includes(horario)
                );

                res.json(horariosDisponiveis);
            }
        }
    );
});


// ROTA PRA CADASTRAR UM AGENDAMENTO
app.post('/cadastrar-agendamento', (req, res) => {
    const { cpf, servico, data, profissional, hora } = req.body;
    db.run("INSERT INTO Agenda (cpf_cliente, sala, data, cpf_profissional, horario) VALUES (?, ?, ?, ?, ?)", 
        [cpf, servico, data, profissional, hora], function (err) {
        if (err) {
            console.error('Erro ao cadastrar agendamento:', err);
            res.status(500).send('Erro ao cadastrar agendamento');
        } else {
            res.send('Agendamento cadastrado com sucesso!');
        }
    });
});


// ***********************************
// ***********************************
// *******   CONSULTAR   *************
// ***********************************
// ***********************************

// ROTA PARA BUSCAR AGENDAMENTOS POR DATA E/OU CPF
app.get('/buscar-agendamentos', (req, res) => {
    const { data, cpf, profissional } = req.query;

    // Construindo a query base
    let query = `
        SELECT 
            a.id,
            a.data,
            c.nome AS nome_cliente,
            c.telefone,
            p.nome AS nome_profissional,
            s.nome AS nome_servico,
            s.valor,
            a.horario
        FROM Agenda a
        JOIN profissional p ON a.cpf_profissional = p.cpf
        JOIN Cliente c ON a.cpf_cliente = c.cpf
        JOIN Servico s ON a.sala = s.id
        WHERE 1=1
    `;

    const params = [];

    // Adicionando filtro de data
    if (data) {
        query += ' AND a.data = ?';
        params.push(data);
    }

    // Adicionando filtro de CPF
    if (cpf) {
        query += ' AND c.cpf = ?';
        params.push(cpf);
    }

    // Adicionando filtro de profissional
    if (profissional) {
        query += ' AND p.cpf = ?';
        params.push(profissional);
    }

    // Executando a consulta no banco
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar agendamentos:', err);
            res.status(500).send('Erro ao buscar agendamentos');
        } else {
            res.json(rows); // Retornando os agendamentos encontrados
        }
    });
});


// Rota para excluir um agendamento
app.delete('/excluir-agendamento', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM Agenda WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir agendamento:', err);
            return res.status(500).send('Erro ao excluir agendamento');
        }
        res.send('Agendamento excluído com sucesso');
    });
});


// Teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
    res.send("Servidor está rodando e tabelas criadas!");
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
