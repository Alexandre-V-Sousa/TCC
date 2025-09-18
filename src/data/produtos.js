// data/produtos.js
const produtos = [
  {
    id: 1,
    nome: "Ração Premium para Cães Adultos 10kg",
    preco: 159.9,
    imagem: [
      "/cachorro/RaçãoCachorro.jpg",
      "/cachorro/BrinquedosCachorro.jpg",
      "/cachorro/PetiscoCachorro.jpg",
    ],
    categoria: "Alimentação",
    marca: "Golden",
    descricao:
      "Ração premium para cães adultos, com vitaminas, minerais e proteínas balanceadas para saúde e energia.",
    especificacoes: {
      peso: "10kg",
      sabor: "Carne & Vegetais",
      indicado: "Cães Adultos",
      validade: "12 meses",
    },
  },
  {
    id: 2,
    nome: "Areia Higiênica para Gatos 4kg",
    preco: 39.9,
    imagem: [
      "/gato/AreiaGatos.jpg",
      "/gato/HigieneGato.jpg",
      "/gato/CatLitter.jpg",
    ],
    categoria: "Higiene",
    marca: "Pipicat",
    descricao:
      "Areia higiênica de alta absorção, controla odores e facilita a limpeza da caixa de areia.",
    especificacoes: {
      peso: "4kg",
      aroma: "Neutro",
      indicado: "Gatos de todas as idades",
      absorcao: "99%",
    },
  },
  {
    id: 3,
    nome: "Brinquedo Mordedor para Cães",
    preco: 29.9,
    imagem: [
      "/cachorro/BrinquedosCachorro.jpg",
      "/cachorro/BrinquedoBola.jpg",
    ],
    categoria: "Brinquedos",
    marca: "PetFun",
    descricao:
      "Brinquedo mordedor resistente, ideal para cães de médio e grande porte, ajuda na saúde dental.",
    especificacoes: {
      material: "Borracha atóxica",
      tamanho: "15cm",
      indicado: "Cães de porte médio/grande",
      durabilidade: "Alta",
    },
  },
];

export default produtos;
