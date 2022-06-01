const PROTO_PATH = "./cliente.proto";

const grpc = require("grpc");
const carregarProto = require("@grpc/proto-loader");
const { v4 : uuidv4 } = require("uuid");

const definicao = carregarProto.loadSync(PROTO_PATH,{
    keepCase:true,
    longs:String,
    enums:String,
    arrays:true
});

const clientesProto = grpc.loadPackageDefinition(definicao);

const server = new grpc.Server();

const clientes = [
    {
        id : "515151515",
        nome : "Marcos de Oliveira",
        email : "marcos.oliveira@gmail.com",
        cpf : "65454584541",
        telefone : "7845754"
    },
    {
        id : "51515fjfj5",
        nome : "Wagner de Oliveira",
        email : "wagner.oliveira@gmail.com",
        cpf : "65454584541",
        telefone : "7845754"
    },
    {
        id : "515151515",
        nome : "Thais de Oliveira",
        email : "thais.oliveira@gmail.com",
        cpf : "65454584541",
        telefone : "7845754"
    },

];

server.addService(clientesProto.GerenciarClientes.service,{
    listarTodos:(_,callback) =>{
        callback(null,{clientes});
        
    },
    listar:(call,callback) =>{
        let cliente = clientes.find(n => n.id ==call.request.id);
        if(cliente){
            callback(null,cliente)
        }
        else{
            callback({code:grpc.status.NOT_FOUND,details:"Not Found"})
        }
    },
    cadastrar:(call,callback) =>{
        let cliente = call.request;

        cliente.id = uuidv4();
        clientes.push(cliente);
        callback(null,cliente)
    },
    atualizar:(call, callback) =>{

        let clientecad = clientes.find(n => n.id ==call.request.id);

        if(clientecad){
            clientecad.nome = call.request.nome
            clientecad.email = call.request.email
            clientecad.cpf = call.request.cpf
            clientecad.telefone =call.request.telefone
            callback(null,clientecad)
        }
        else{
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Not Found"
            })
        }
    },
    apagar:(call,callback)=>{
        let clientecadid = clientes.findIndex(
            n => n.id === call.request.id
        );
            if(clientecadid != -1){
                clientes.splice(clientecadid, 1);
                callback(null,{})
            }
            else{
                callback({
                    code:grpc.status.NOT_FOUND,
                    details:"Not Found"
                });
            }

    }
});
server.bind("127.0.0.1:30043",grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
