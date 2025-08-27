// let GlobalURL;

// let LocalGlobalURL =[
// {
//     url : "https://opmanual.franchise.care/php/public/api/v1",
//     version: "1.0"
// }
// ];

// let LiveGlobalURL = [
// {
//     url:"https://opmanual.franchise.care/php/public/api/v1",
//     version: "1.0"
// }
// ];

// let StagingGlobalURL =[
//     {
//     url: "https://opmanual.franchise.care/php/public/api/v1",
//     version: "1.0"
//     }
// ]

// export default GlobalURL = 
// window.location.hostname === "localhost" ? LocalGlobalURL: window.location.hostname ==="opman.retailcare.au" ? StagingGlobalURL : LiveGlobalURL;



let GlobalURL;

let LocalGlobalURL =[
{
    url : "https://opmanual.franchise.care/php/public/api/v1",
    version: "1.0"
}
];

let LiveGlobalURL = [
{
    url:"https://opmanual.franchise.care/php/public/api/v1",
    version: "1.0"
}
];

let StagingGlobalURL =[
    {
    url: "https://opmanual.franchise.care/php/public/api/v1",
    version: "1.0"
    }
]

export default GlobalURL = 
window.location.hostname === "localhost" ? LocalGlobalURL: window.location.hostname ==="opmanual.franchise.care" ? StagingGlobalURL : LiveGlobalURL;