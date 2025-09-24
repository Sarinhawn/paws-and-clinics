import { NextRequest, NextResponse } from 'next/server'

// Dados mocados dos exames (você pode substituir por uma conexão com banco de dados)
const examesData = [
  {
    id: 1,
    nome: "Exame de sangue - Rex",
    pet: "Rex",
    tipo: "Sangue",
    data: "2025-09-01",
    dataFormatada: "01/09/2025",
    arquivo: "/exames/exame_de_sangue.pdf",
    status: "Disponível"
  },
  {
    id: 2,
    nome: "Raio-X - Nina", 
    pet: "Nina",
    tipo: "Raio-X",
    data: "2025-08-20",
    dataFormatada: "20/08/2025",
    arquivo: "/exames/sentado.png",
    status: "Disponível"
  },
  {
    id: 3,
    nome: "Ultrassom - Buddy",
    pet: "Buddy", 
    tipo: "Ultrassom",
    data: "2025-08-15",
    dataFormatada: "15/08/2025",
    arquivo: "/exames/ultrassom_buddy.pdf",
    status: "Disponível"
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'data'
    
    let filteredExames = [...examesData]
    
    // Filtrar por termo de busca se fornecido
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredExames = filteredExames.filter(exame => 
        exame.nome.toLowerCase().includes(searchTerm) ||
        exame.pet.toLowerCase().includes(searchTerm) ||
        exame.tipo.toLowerCase().includes(searchTerm)
      )
    }
    
    // Ordenar
    filteredExames.sort((a, b) => {
      if (sortBy === 'data') {
        return new Date(b.data).getTime() - new Date(a.data).getTime()
      }
      return a.nome.localeCompare(b.nome)
    })
    
    return NextResponse.json({
      success: true,
      data: filteredExames,
      total: filteredExames.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Aqui você adicionaria a lógica para criar um novo exame
    const novoExame = {
      id: examesData.length + 1,
      ...body,
      status: 'Disponível'
    }
    
    examesData.push(novoExame)
    
    return NextResponse.json({
      success: true,
      data: novoExame,
      message: 'Exame criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar exame' },
      { status: 500 }
    )
  }
}