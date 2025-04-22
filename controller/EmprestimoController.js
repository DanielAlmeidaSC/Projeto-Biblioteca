import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";
import Usuario from "../model/UsuarioModel.js";

async function listar(req, res) {
    const respostaBanco = await Emprestimo.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Emprestimo.findByPk(id);
    res.json(respostaBanco);
}

async function emprestar(req, res) {
    
    const idlivro = req.body.idlivro;
    const idusuario = req.body.idusuario;

    if (!idlivro) {
        res.status(422).send('O parâmetro idlivro é obrigatório.');
    }

    if (!idusuario) {
        res.status(422).send('O parâmetro idusuario é obrigatório.');
    }

    const livroBanco = await Livro.findByPk(idlivro);
    if (!livroBanco) {
        res.status(404).send('Livro não encontrado.');
    }

    const usuarioBanco = await Usuario.findByPk(idusuario);
    if (!usuarioBanco) {
        res.status(404).send('Usuário não encontrado.');
    }

    if (!livroBanco.ativo) {
        res.status(422).send('Este livro está inativo.');
    }

    if (livroBanco.emprestado) {
        res.status(422).send('Este livro já está emprestado.');
    }

    const emprestimoPendente = await Emprestimo.findOne({ 
        where: { idusuario: req.body.idusuario, devolvido: false }
    });

    const emprestimo = moment().format('YYYY-MM-DD');
    const vencimento = moment().add(15, 'days').format('YYYY-MM-DD');

    const respostaBanco = await Emprestimo.create({ idlivro, idusuario, emprestimo, vencimento });

    const emprestado = true;
    await Livro.update(
        { emprestado },
        { where: { idlivro } });

    res.json(respostaBanco);

}


//Questão 1
import Multa from '../model/MultaModel.js';

async function devolver(req, res) {

    const idemprestimo = req.params.id;
    const observacao = req.body.observacao || '';
    
    try {
        const emprestimoBanco = await Emprestimo.findByPk(idemprestimo);
        
        if (!emprestimoBanco) {
            return res.status(404).send('Empréstimo não encontrado.');
        }
        
        if (emprestimoBanco.devolucao !== null) {
            return res.status(422).send('Este livro já foi devolvido.');
        }
        
        const devolucao = moment().format('YYYY-MM-DD');
        
        const respostaBanco = await Emprestimo.update(
            { devolucao, observacao },
            { where: { idemprestimo } }
        );
        
        await Livro.update(
            { emprestado: false },
            { where: { idlivro: emprestimoBanco.idlivro } }
        );
        
        // Questão 9
        const dataVencimento = moment(emprestimoBanco.vencimento);
        const dataDevolucao = moment(devolucao);
        
        const diasAtraso = dataDevolucao.diff(dataVencimento, 'days');
        
        if (diasAtraso > 0) {
            const valorMulta = diasAtraso * 2.50;
            
            const dataVencimentoMulta = moment(devolucao).add(30, 'days').format('YYYY-MM-DD');
            
            const multa = await Multa.create({
                idemprestimo,
                valor: valorMulta,
                vencimento: dataVencimentoMulta,
                pagamento: null 
            });
            
            return res.json({ 
                message: "Devolução realizada com sucesso. Multa por atraso registrada.",
                dadosAtualizados: respostaBanco,
                multa: {
                    id: multa.idmulta,
                    valor: valorMulta,
                    diasAtraso,
                    vencimento: dataVencimentoMulta
                }
            });
        }
        
        return res.json({ 
            message: "Devolução realizada com sucesso",
            dadosAtualizados: respostaBanco
        });
    } catch (error) {
        res.status(500).send(`Erro ao processar a devolução: ${error.message}`);
    }
}


export default { listar, selecionar, emprestar, devolver };