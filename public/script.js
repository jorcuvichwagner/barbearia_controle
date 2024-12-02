function limparTodosOsCampos() {
    const inputs = document.querySelectorAll('input, textarea, select'); // Seleciona todos os inputs, textareas e selects
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false; // Desmarca checkboxes e radio buttons
        } else {
            input.value = ''; // Limpa outros campos
        }
    });
    datahoje();
}

function datahoje(){
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Preencher os campos com a data de hoje
    document.getElementById("data").value = dataFormatada;

}


// ************************************
// ************************************
// *****       SERVIÇOS       *********
// ************************************
// ************************************

// Função para cadastrar servico
async function cadastrar_servico() {
    const nome_s = document.getElementById('nome_servico').value;
    const preco_s = document.getElementById('preco_servico').value;

    await fetch('/cadastrar-servico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_s, preco_s })
    }).then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('Servicos').reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar serviço:', error);
    });
}

// ************************************
// ************************************
// *****      PROFISSIONAIS   *********
// ************************************
// ************************************

// Função para cadastrar profissional
async function cadastrarFuncionario() {

    const nome_f = document.getElementById('nome').value;
    const email_f = document.getElementById('email').value;
    const tel_f = document.getElementById('telefone').value;
    const cpf_f = document.getElementById('cpf').value;
    const data_f = document.getElementById('data_nascimento').value;
    

    const funcionarioData = { nome_f, email_f, tel_f, cpf_f, data_f };


    await fetch('/cadastrar-funcionario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionarioData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('cadastrofuncionario').reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar funcionário:', error);
    });
} 

async function verificarFuncionario() {
    const cpf = document.getElementById('cpf').value;

    if (!cpf) return; // Não faz nada se o CPF estiver vazio

    await fetch(`/buscar-funcionario?cpf=${cpf}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar funcionário');
            }
            return response.json();
        })
        .then(funcionario => {
            if (funcionario) {
                // Preenche os campos com os dados do funcionário
                document.getElementById('nome').value = funcionario.nome;
                document.getElementById('email').value = funcionario.email;
                document.getElementById('telefone').value = funcionario.telefone;
                document.getElementById('data_nascimento').value = funcionario.data_nascimento;

                // Esconde o botão "Cadastrar" e exibe o botão "Atualizar"
                //document.getElementById('btnCadastrar').style.display = 'none';
                document.getElementById('btnAtualizar').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar funcionário:', error);
            alert('Erro ao buscar funcionário...');
        });
}


async function atualizarFuncionario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const data = document.getElementById('data_nascimento').value;
    document.getElementById('btnAtualizar').style.display = 'none';

    const funcionarioData = { nome, email, telefone, data, cpf };

    await fetch('/atualizar-funcionario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionarioData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Erro ao atualizar funcionário:', error);
        alert('Erro ao atualizar funcionário.');
    });
    
}

// ************************************
// ************************************
// *****        CLIENTES      *********
// ************************************
// ************************************
async function cadastrarCliente(){
    
    const nome_c = document.getElementById('nomecliente').value;
    const cpf_c = document.getElementById('cpf_cliente').value;
    const telefone_c = document.getElementById('telcliente').value;
    const endereco_c = document.getElementById('email').value;
    await fetch('/cadastrar-cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_c, cpf_c, telefone_c, endereco_c })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('FormCadastroCliente').reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar cliente:', error);
    });
}
async function verificarCliente() {
    const cpf = document.getElementById('cpf_cliente').value;

    if (!cpf) return; // Não faz nada se o CPF estiver vazio

    await fetch(`/buscar-cliente?cpf=${cpf}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar cliente');
            }
            return response.json();
        })
        .then(cliente => {
            if (cliente) {
                // Preenche os campos com os dados do cliente
                document.getElementById('nomecliente').value = cliente.nome;
                document.getElementById('telcliente').value = cliente.telefone;
                document.getElementById('email').value = cliente.email;

                // Esconde o botão "Cadastrar" e exibe o botão "Atualizar"
                document.getElementById('btnCadastrarCliente').style.display = 'none';
                document.getElementById('btnAtualizarCliente').style.display = 'block';
            } else {
                // Limpa os campos para cadastro
                resetarFormularioCliente();
            }
        })
        .catch(error => {
            console.error('Erro ao buscar cliente:', error);
            alert('Erro ao buscar cliente.');
        });
}

function resetarFormularioCliente() {
    document.getElementById('btnCadastrarCliente').style.display = 'block';
    document.getElementById('btnAtualizarCliente').style.display = 'none';
}

async function atualizarCliente() {
    const nome = document.getElementById('nomecliente').value;
    const cpf = document.getElementById('cpf_cliente').value;
    const telefone = document.getElementById('telcliente').value;
    const endereco = document.getElementById('email').value;

    const clienteData = { nome, cpf, telefone, endereco };

    await fetch('/atualizar-cliente', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        resetarFormularioCliente();
    })
    .catch(error => {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    });
}


// ************************************
// ************************************
// *****      AGENDAMENTO     *********
// ************************************ 
// ************************************    

async function buscaServico() {

    fetch('/buscar-servicos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar serviços');
            }
            return response.json();
        })
        .then(servicos => {
            const select = document.getElementById('servicoSelecionado');
            servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.id; // Usa o id como valor
                option.textContent = `${servico.nome}  R$ ${servico.valor},00`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os serviços:', error);
        });
}


function buscarClienteAgenda() {
    const cpf = document.getElementById('cpf').value;

    if (!cpf) return; // Não faz nada se o CPF estiver vazio

    fetch(`/buscar-cliente?cpf=${cpf}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar cliente');
            }
            return response.json();
        })
        .then(cliente => {
            if (cliente) {
                // Preenche os campos com os dados do cliente
                document.getElementById('nomeCliente').innerHTML = cliente.nome;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar cliente:', error);
            alert('Erro ao buscar cliente.');
        });
}

async function buscaProfissionais() {

    fetch('/buscar-profissionais')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar profissionais');
            }
            return response.json();
        })
        .then(servicos => {
            const select = document.getElementById('profissionalSelecionado');
            servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.cpf; 
                option.textContent = servico.nome;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os profissionais:', error);
        });
}

function buscaHorariosDisponiveis() {
    const data = document.getElementById('data').value;
    const idServico = document.getElementById('profissionalSelecionado').value;

    // Verifica se ambos os campos estão preenchidos
    if (!data || !idServico) {
        return; // Aguarde até que ambos os campos estejam preenchidos
    }

    fetch(`/horarios-disponiveis?data=${data}&idServico=${idServico}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar horários disponíveis');
            }
            return response.json();
        })
        .then(horariosDisponiveis => {
            const selectHorario = document.getElementById('horaSelecionada');
            selectHorario.innerHTML = '<option value="">Selecione o Horário</option>';

            if (horariosDisponiveis.length > 0) {
                horariosDisponiveis.forEach(horario => {
                    const option = document.createElement('option');
                    option.value = horario;
                    option.textContent = horario;
                    selectHorario.appendChild(option);
                });
            } else {
                alert('Não há horários disponíveis para esta data e serviço.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar horários disponíveis:', error);
        });
}

async function cadastrarAgendamento() {
    
    const cpf = document.getElementById('cpf').value; 
    const servico = document.getElementById('servicoSelecionado').value;
    const data = document.getElementById('data').value;
    const profissional = document.getElementById('profissionalSelecionado').value;
    const hora = document.getElementById('horaSelecionada').value;


    const petData = { cpf, servico, data, profissional, hora };

    await fetch('/cadastrar-agendamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('CadastroPet').reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar agendamento:', error);
    });
}


function buscarAgendamentos() {
    document.getElementById("tabelaAgendamento_box").innerHTML = `
    <div class="cad">
        <div id="resultadoConsulta">
            <h3>Resultados da Consulta</h3>
            <table id="tabelaAgendamento">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Telefone</th>
                        <th>Profissional</th>
                        <th>Serviço</th>
                        <th>Valor</th>
                        <th>Horario</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Resultados da consulta serão inseridos aqui pelo script -->
                </tbody>
            </table>
        </div>
    </div>
    `;
    
    const data = document.getElementById('data').value;
    const cpf = document.getElementById('cpf').value;
    const profissional = document.getElementById('profissionalSelecionado').value;
    
    // Construindo os parâmetros de consulta
    const queryParams = new URLSearchParams();
    if (data) queryParams.append('data', data);
    if (cpf) queryParams.append('cpf', cpf);
    if (profissional) queryParams.append('profissional', profissional);
    
    fetch(`/buscar-agendamentos?${queryParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar agendamentos');
            }
            return response.json();
        })
        .then(agendamentos => {
            const tabelaBody = document.querySelector('#tabelaAgendamento tbody');
            tabelaBody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

            if (agendamentos.length > 0) {
                agendamentos.forEach((agendamento, index) => {
                    const linha = document.createElement('tr');

                    // Alternância de cores das linhas
                    linha.className = index % 2 === 0 ? 'linha-par' : 'linha-impar';

                    linha.innerHTML = `
                        <td>${agendamento.data}</td>
                        <td>${agendamento.nome_cliente}</td>
                        <td>${agendamento.telefone}</td>
                        <td>${agendamento.nome_profissional}</td>
                        <td>${agendamento.nome_servico}</td>
                        <td>R$ ${agendamento.valor},00</td>
                        <td>${agendamento.horario}</td>
                        <td> <button onclick="excluirAgendamentos(${agendamento.id}); removerAgendamento(this);">excluir</button></td>
                    `;
                    tabelaBody.appendChild(linha);
                });
            } else {
                const linha = document.createElement('tr');
                linha.innerHTML = `<td colspan="8">Nenhum agendamento encontrado.</td>`;
                tabelaBody.appendChild(linha);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar agendamentos:', error);
        });
        
}


async function excluirAgendamentos(id) {
    try {
        const response = await fetch(`/excluir-agendamento?id=${id}`,
        { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir agendamento');
        alert('Agendamento excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento');
    }
}

function removerAgendamento(botao){
    botao.closest("tr").remove();
}