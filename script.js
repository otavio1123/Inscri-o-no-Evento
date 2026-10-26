const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
const resumo = document.getElementById('resumo')

let cidadesDoEstado = []

const URL_ESTADOS =
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar estados')
            }

            return response.json()
        })
        .then(estados => {
            selectEstado.innerHTML =
                '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const option = document.createElement('option')

                option.value = estado.sigla
                option.textContent = estado.nome
                option.dataset.id = estado.id

                selectEstado.appendChild(option)
            })
        })
        .catch(() => {
            selectEstado.innerHTML =
                '<option value="">Erro ao carregar estados</option>'
        })
}

selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value

    const opcaoSelecionada =
        selectEstado.options[selectEstado.selectedIndex]

    const idEstado = opcaoSelecionada.dataset.id

    qtdCidades.textContent = ''
    filtroCidade.value = ''
    resumo.textContent = ''

    if (uf === '') {
        selectCidade.disabled = true
        filtroCidade.disabled = true

        selectCidade.innerHTML =
            '<option value="">Escolha um estado primeiro</option>'

        return
    }

    selectCidade.disabled = true
    filtroCidade.disabled = true

    selectCidade.innerHTML =
        '<option value="">Carregando...</option>'

    fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios?orderBy=nome`
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar cidades')
            }

            return response.json()
        })
        .then(cidades => {
            cidadesDoEstado = cidades

            preencherCidades(cidades)

            selectCidade.disabled = false
            filtroCidade.disabled = false

            qtdCidades.textContent =
                `${cidades.length} cidades encontradas`
        })
        .catch(() => {
            selectCidade.innerHTML =
                '<option value="">Erro ao carregar cidades</option>'

            qtdCidades.textContent =
                'Não foi possível carregar as cidades.'

            selectCidade.disabled = true
            filtroCidade.disabled = true
        })
})

function preencherCidades(cidades) {
    selectCidade.innerHTML =
        '<option value="">Selecione a cidade</option>'

    cidades.forEach(cidade => {
        const option = document.createElement('option')

        option.value = cidade.nome
        option.textContent = cidade.nome

        selectCidade.appendChild(option)
    })
}

filtroCidade.addEventListener('input', () => {
    const texto = filtroCidade.value.toLowerCase()

    const cidadesFiltradas = cidadesDoEstado.filter(cidade =>
        cidade.nome.toLowerCase().includes(texto)
    )

    preencherCidades(cidadesFiltradas)
})

document
    .getElementById('formInscricao')
    .addEventListener('submit', evento => {
        evento.preventDefault()

        const nome = document.getElementById('nome').value
        const uf = selectEstado.value
        const cidade = selectCidade.value

        if (uf === '' || cidade === '') {
            resumo.textContent =
                'Selecione um estado e uma cidade.'
            return
        }

        resumo.textContent =
            `${nome}, de ${cidade}/${uf}, inscrito com sucesso.`
    })

carregarEstados()