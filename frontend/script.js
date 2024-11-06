let provider;
// if (window.ethereum == null) {
//     console.log("MetaMask not installed; using read-only defaults")
//     provider = ethers.getDefaultProvider()

// } else {
    provider = new ethers.BrowserProvider(window.ethereum)
//     // signer = await provider.getSigner();
// }

let signer;

const tokenAbi = [
    "constructor(uint256 initialsupply)",
    "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)",
    "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
    "error ERC20InvalidApprover(address approver)",
    "error ERC20InvalidReceiver(address receiver)",
    "error ERC20InvalidSender(address sender)",
    "error ERC20InvalidSpender(address spender)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)"
];
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let tokenContract = null;

const dexAbi = [
    "constructor(address _token, uint256 _price)",
    "function associatedToken() view returns (address)",
    "function buy(uint256 numTokens) payable",
    "function currentAddress() view returns (address)",
    "function currentPrice() view returns (uint256)",
    "function getPrice(uint256 numTokens) view returns (uint256)",
    "function getTokenBalance() view returns (uint256)",
    "function sell()",
    "function withdrawFunds()",
    "function withdrawTokens()"
];
const dexAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
let dexContract = null;

async function getAccess() {
    if(tokenContract) return;
    
    await provider.send("eth_requestAccounts",[]);
    // await window.ethereum.request({method: 'eth_requestAccounts'});

    signer = await provider.getSigner()
    
    tokenContract = new ethers.Contract(tokenAddress,tokenAbi,signer);
    dexContract = new ethers.Contract(dexAddress,dexAbi,signer);
}

async function updatePrice(){
    await getAccess();

    const price = await dexContract.getPrice(1);
    document.getElementById('token_price').innerHTML = price;

    return price;
}

async function getTokensAvailable(){
    await getAccess();
    
    const tokens = await dexContract.getTokenBalance();
    document.getElementById('tokens_available').innerHTML = tokens;
}

async function getMyTokenBalance(){
    await getAccess();

    const balance = await tokenContract.balanceOf(await signer.getAddress());
    document.getElementById('get_token_balance').innerHTML = balance;
}

async function grantAccess(){
    await getAccess();

    const value = document.getElementById('token_grant').value;

    await tokenContract.approve(dexAddress,value)
    .then(() => alert("success"))
    .catch((error) => alert(error)) 
}

async function sellToken(){
    await getAccess();

    await dexContract.sell()
    .then(() => alert("success"))
    .catch((error) => alert(error)) 
}

async function buyTokens(){
    await getAccess();
    const tokenAmount = document.getElementById('tokenToBuy').value;
    console.log(tokenAmount);
    const checkPrice = await updatePrice();
    const value = Number(checkPrice) * tokenAmount;

    await dexContract.buy(tokenAmount,{value : value})
    .then(() => alert("success"))
    .catch((error) => alert(error)) 
}