import type { Proveedor } from "../types/Proveedor";

const BASE_URL = 'http://localhost:8080'

export const ProveedorService={
    getProveedores:async():Promise<Proveedor[]>=>{ 
    
    const response = await fetch(`${BASE_URL}/Proveedor`);
    const data = await response.json();
    return data;
},

getProveedor:async(id:number): Promise<Proveedor>=>{
    const response=await fetch(`${BASE_URL}/Proveedor/${id}`);
    const data = await response.json();
    return data;
},
createProveedor:async (proveedor:Proveedor):Promise<Proveedor> => {

    const response = await fetch(`${BASE_URL}/Proveedor`
        ,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(proveedor)
    });
    const data = await response.json();
    return data;
    
},
updateProveedor:async (id:number,proveedor:Proveedor):Promise<Proveedor> => {

    const response = await fetch(`${BASE_URL}/Proveedor/${id}`
        ,{
        method: "PUT",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(proveedor)
    });
    const data = await response.json();
    return data;
    
},deleteProveedor:async (id:number):Promise<void> => {

    const response = await fetch(`${BASE_URL}/Proveedor/${id}`
        ,{
        method: "DELETE",
        
    });
    if(!response.ok){
        throw new Error('Network response was not ok')
    }
      // Si el código de estado es 204, no intentes parsear JSON

    if(response.status === 204){
        return;
    }
      // Si esperas una respuesta con contenido, parsea JSON

    const contentType= response.headers.get('content-type');
    if(contentType && contentType.includes('aplication/json')){
const data = await response.json();
    return data;

    }
    
    
},bajaLogicaProveedor:async (id:number,proveedor:Proveedor): Promise<void> =>{
     proveedor.fechaHoraBajaProv=new Date();
 const response = await fetch(`${BASE_URL}/Proveedor/${id}`
        ,{
        method: "PUT",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(proveedor)
    });
    const data = await response.json();
    return data;
  }

    }
