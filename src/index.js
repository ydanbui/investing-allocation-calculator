import "core-js/stable"
import "regenerator-runtime/runtime"
import getLatestPrice from './requests'
 
getLatestPrice('IVV').then(price => {
    console.log(price)
}).catch(err => {
    console.log(`Error: ${err}`)
})