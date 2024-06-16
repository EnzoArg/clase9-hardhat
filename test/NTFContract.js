// Importamos Chai para las aserciones y la función expect
const { expect } = require("chai");

describe("NFTContract", function () {
  let NFTContract;
  let nft;
  let owner;
  let addr1;
  let addr2;

  // Configuramos el entorno antes de cada prueba
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners(); // Obtenemos las cuentas de Ethereum
    NFTContract = await ethers.getContractFactory("NFTContract"); // Obtenemos la factoría del contrato
    nft = await NFTContract.deploy(); // Desplegamos el contrato
    await nft.deployed(); // Esperamos a que el contrato se despliegue
  });

  // Prueba para mintear un nuevo NFT
  it("Should mint a new NFT", async function () {
    await nft.mint(addr1.address, 1); // Llamamos a la función mint del contrato
    expect(await nft.ownerOf(1)).to.equal(addr1.address); // Verificamos que addr1 sea el dueño del token 1
  });

  // Prueba para transferir un NFT a otra dirección
  it("Should transfer NFT to another wallet", async function () {
    await nft.mint(addr1.address, 1); // Minteamos un nuevo token y lo asignamos a addr1
    
    // Verificamos que addr1 es el dueño del token 1
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // Transferimos el token 1 de addr1 a addr2
    await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1);

    // Verificamos que addr2 ahora es el dueño del token 1
    expect(await nft.ownerOf(1)).to.equal(addr2.address);
  });

  // Puedes agregar más pruebas aquí según sea necesario
});
