import { NextRequest, NextResponse } from 'next/server'

// Dados mocados dos pets
const petsData = [
  {
    id: 1,
    nome: "Rex",
    especie: "Cachorro",
    raca: "Golden Retriever", 
    idade: 3,
    peso: 28.5,
    proprietario: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao@email.com"
  },
  {
    id: 2,
    nome: "Nina",
    especie: "Gato",
    raca: "Siamês",
    idade: 2,
    peso: 4.2,
    proprietario: "Maria Santos",
    telefone: "(11) 88888-8888", 
    email: "maria@email.com"
  },
  {
    id: 3,
    nome: "Buddy",
    especie: "Cachorro",
    raca: "Labrador",
    idade: 5,
    peso: 32.0,
    proprietario: "Carlos Oliveira",
    telefone: "(11) 77777-7777",
    email: "carlos@email.com"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let filteredPets = [...petsData]
    
    // Filtrar por termo de busca se fornecido
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredPets = filteredPets.filter(pet => 
        pet.nome.toLowerCase().includes(searchTerm) ||
        pet.especie.toLowerCase().includes(searchTerm) ||
        pet.raca.toLowerCase().includes(searchTerm) ||
        pet.proprietario.toLowerCase().includes(searchTerm)
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredPets,
      total: filteredPets.length
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
    
    const novoPet = {
      id: petsData.length + 1,
      ...body
    }
    
    petsData.push(novoPet)
    
    return NextResponse.json({
      success: true,
      data: novoPet,
      message: 'Pet cadastrado com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao cadastrar pet' },
      { status: 500 }
    )
  }
}