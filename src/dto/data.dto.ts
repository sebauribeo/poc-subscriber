export class DataDTO {
    sku: string;
    producto: string;
    tipo: string;
    stock: string;
    imagen: string;
    precio: number;

    constructor (data: DataDTO) {
        this.sku = data.sku;
        this.producto = data.producto;
        this.tipo = data.tipo;
        this.stock = data.stock;
        this.imagen = data.imagen;
        this.precio = data.precio;
    }

}