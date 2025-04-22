//Questão 2

import Funcionario from '../models/FuncionarioModel.js';

const listarFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    return res.status(200).json(funcionarios);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar funcionários', error: error.message });
  }
};

const selecionarFuncionario = async (req, res) => {
  try {
    const { id } = req.params;
    const funcionario = await Funcionario.findByPk(id);
    
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    return res.status(200).json(funcionario);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar funcionário', error: error.message });
  }
};

const inserirFuncionario = async (req, res) => {
  // Validação dos campos obrigatórios
  const { nomefuncionario, email, salario, contratacao } = req.body;
  
  const errors = [];
  
  if (!nomefuncionario) {
    errors.push('O nome do funcionário é obrigatório');
  }
  
  if (!email) {
    errors.push('O email é obrigatório');
  }
  
  if (salario === undefined || salario === null) {
    errors.push('O salário é obrigatório');
  }
  
  if (!contratacao) {
    errors.push('A data de contratação é obrigatória');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  try {
    const { 
      cpf, 
      telefone, 
      nascimento
    } = req.body;
    
    const novoFuncionario = await Funcionario.create({
      nomefuncionario,
      cpf,
      email,
      telefone,
      nascimento,
      salario,
      contratacao
    });
    
    return res.status(201).json({
      message: 'Funcionário cadastrado com sucesso',
      funcionario: novoFuncionario
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar funcionário', error: error.message });
  }
};

const alterarFuncionario = async (req, res) => {
  const { nomefuncionario, email, salario, contratacao } = req.body;
  
  const errors = [];
  
  if (!nomefuncionario) {
    errors.push('O nome do funcionário é obrigatório');
  }
  
  if (!email) {
    errors.push('O email é obrigatório');
  }
  
  if (salario === undefined || salario === null) {
    errors.push('O salário é obrigatório');
  }
  
  if (!contratacao) {
    errors.push('A data de contratação é obrigatória');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  try {
    const { id } = req.params;
    const { 
      cpf, 
      telefone, 
      nascimento 
    } = req.body;
    
    const funcionario = await Funcionario.findByPk(id);
    
    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado' });
    }
    
    await funcionario.update({
      nomefuncionario,
      cpf,
      email,
      telefone,
      nascimento,
      salario,
      contratacao
    });
    
    return res.status(200).json({
      message: 'Funcionário atualizado com sucesso',
      funcionario
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar funcionário', error: error.message });
  }
};


//Questão 3
async function demitir(req, res) {
    // Obter o ID do funcionário dos parâmetros
    const idfuncionario = req.params.id;
    
    const dataDemissao = req.body.dataDemissao || moment().format('YYYY-MM-DD');
    
    try {
        const funcionarioBanco = await Funcionario.findByPk(idfuncionario);
        
        if (!funcionarioBanco) {
            return res.status(404).send('Funcionário não encontrado.');
        }
        
        if (funcionarioBanco.demissao !== null || funcionarioBanco.ativo === false) {
            return res.status(422).send('Este funcionário já foi demitido anteriormente.');
        }
        
        const respostaBanco = await Funcionario.update(
            { 
                demissao: dataDemissao, 
                ativo: false 
            },
            { where: { idfuncionario } }
        );
        
        res.json({ 
            message: "Demissão registrada com sucesso",
            dadosAtualizados: respostaBanco
        });
    } catch (error) {
        res.status(500).send(`Erro ao processar a demissão: ${error.message}`);
    }
}

//Questão 7
async function definirSenha(req, res) {
    const idusuario = req.params.id;
    const { senha } = req.body;
    
    try {
        const usuarioBanco = await Usuario.findByPk(idusuario);
        
        if (!usuarioBanco) {
            return res.status(404).send('Usuário não encontrado.');
        }
        
        if (!senha || senha.length < 6 || senha.length > 20) {
            return res.status(422).send('A senha deve ter entre 6 e 20 caracteres.');
        }
        
        const respostaBanco = await Usuario.update(
            { senha },
            { where: { idusuario } }
        );
        
        res.json({ 
            message: "Senha definida com sucesso",
            dadosAtualizados: respostaBanco
        });
    } catch (error) {
        res.status(500).send(`Erro ao definir senha: ${error.message}`);
    }
}

export default {
  listarFuncionarios,
  selecionarFuncionario,
  inserirFuncionario,
  alterarFuncionario,
  demitir,
  definirSenha
};