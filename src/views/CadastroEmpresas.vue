<template>

     <!-- Raiz da aplicação Vuetify -->
    <v-app> 

        <!-- Área principal da aplicação -->
        <v-main> 
        
            <!-- Barra preta -->
            <v-toolbar
                color="black"
                dense
                flat
                :style="{
                    'border-top-left-radius': '12px',
                    'border-top-right-radius': '8px',
                    'position': 'fixed',
                    'top': toolbarHeight + 'px',
                    'left': '260px', 
                    'width': '84.7%',
                    'right': '0',
                    'z-index': '999',
                    'transition': 'left 0.3s ease' 
                }"
            >                      
                <v-toolbar-title class="white--text">Cadastro Empresa</v-toolbar-title> 
                <v-spacer />

            </v-toolbar>

            <!-- Conteúdo com espaçamento -->
            <v-container fluid class="pa-4">

                <!-- Card que agrupa elementos do formulário  -->
                <v-card class="pa-4" style="width: 100%; top: 60px;">

                    <v-form ref="formCadastroEmpresa" v-model="validaCadastroEmpresa">
                    
                        <v-row>
                        
                            <v-col cols="12" md="4">
                                <v-text-field 
                                    label="Empresa" 
                                    v-model="dadosEmpresa.nomeFantasia"
                                    maxlength="255"
                                    :rules="[rules.required]"
                                    v-uppercase
                                />
                            </v-col>
                        
                            <v-col cols="12" md="4">
                                <v-text-field 
                                    label="Razão Social" 
                                    v-model="dadosEmpresa.razaoSocial"
                                    maxlength="255"
                                    :rules="[rules.required]"
                                    v-uppercase
                                />
                            </v-col>
                        
                            <v-col cols="12" md="4">
                                <v-text-field 
                                    label="Apelido" 
                                    maxlength="45"
                                    v-model="dadosEmpresa.apelido" 
                                    v-uppercase
                                />
                            </v-col>

                        </v-row>

                        <v-row>
                        
                            <v-col cols="12" md="4">                        
                                <v-text-field
                                    label="CNPJ"
                                    v-model="dadosEmpresa.cnpj"
                                    :rules="[rules.required]"
                                    v-cnpj-mask
                                    @blur="validarCnpj(dadosEmpresa.cnpj)"
                                    ref="focoCNPJ"
                                />
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field 
                                    label="Inscrição Estadual"
                                    maxlength="45" 
                                    v-model="dadosEmpresa.inscricaoEstadual"
                                    :rules="[rules.required]" 
                                    v-numerico
                                />
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field 
                                    label="Inscrição Municipal"
                                    maxlength="45" 
                                    v-model="dadosEmpresa.inscricaoMunicipal"
                                    v-numerico 
                                />
                            </v-col>
                        
                        </v-row>

                        <v-row>

                            <v-col cols="12" md="4">              
                                <v-select
                                    label="Ramo de Atividade"
                                    v-model="dadosEmpresa.idRamoAtividade"
                                    :items="listaRamosAtividade"
                                    item-title="nome"
                                    item-value="idRamoAtividade"
                                    :rules="[rules.required]"
                                />                
                            </v-col>

                            <v-col cols="12" md="2">
                                <v-select
                                    label="Status de Crédito"
                                    :items="listaStatusCredito"
                                    v-model="dadosEmpresa.idStatusCredito"
                                    item-title="nome"
                                    item-value="idStatusCredito"
                                    :rules="[rules.required]"
                                />
                            </v-col>
                            
                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="Site" 
                                    maxlength="1024"
                                    v-model="dadosEmpresa.urlSite" 
                                    :rules="[rules.required]"
                                />
                            </v-col>
                            
                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="E-mail" 
                                    maxlength="1024"
                                    v-model="dadosEmpresa.emailPrincipal" 
                                    :rules="[rules.required]"
                                />
                            </v-col>
                            
                        </v-row>

                        <v-row>
                            
                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="Fone Principal"
                                    maxlength="45" 
                                    v-model="dadosEmpresa.fonePrincipal" 
                                    v-numerico
                                    :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field   
                                    label="CEP" 
                                    v-model="dadosEmpresa.cep"
                                    maxlength="9"
                                    :rules="[rules.required]"
                                    v-numerico 
                                    @blur="buscaCep(dadosEmpresa.cep)"
                                />
                            </v-col>
                            
                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="País" 
                                    v-model="dadosEmpresa.pais"
                                    maxlength="45"
                                    :rules="[rules.required]" 
                                    v-uppercase
                                />
                            </v-col>
                            
                            <v-col cols="8" md="1">
                                <v-text-field 
                                    label="UF" 
                                    v-model="dadosEmpresa.uf"
                                    maxlength="2"
                                    :rules="[rules.required]" 
                                    v-uppercase
                                />
                            </v-col>

                            <v-col cols="12" md="2">
                                <v-text-field 
                                    label="Cidade" 
                                    v-model="dadosEmpresa.cidade"
                                    maxlength="255"
                                    :rules="[rules.required]" 
                                    v-uppercase
                                />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="Bairro" 
                                    v-model="dadosEmpresa.bairro"
                                    maxlength="255"
                                    :rules="[rules.required]" 
                                    v-uppercase
                                />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field 
                                    label="Logradouro" 
                                    v-model="dadosEmpresa.logradouro"
                                    maxlength="255"
                                    :rules="[rules.required]" 
                                    v-uppercase
                                />
                            </v-col>
                        
                            <v-col cols="12" md="1">
                                <v-text-field 
                                    label="Número" 
                                    v-model="dadosEmpresa.numero"
                                    maxlength="6"
                                    :rules="[rules.required]" 
                                    v-numerico
                                    ref="focoNumero"
                                />
                            </v-col>
                        
                            <v-col cols="12" md="2">
                                <v-text-field 
                                    label="Complemento" 
                                    v-model="dadosEmpresa.complemento" 
                                    maxlength="45"                                    
                                    v-uppercase
                                />
                            </v-col>

                            <v-col cols="12" md="2" class="d-flex align-center">
                                <v-switch
                                    v-model="dadosEmpresa.empresaManutencao"
                                    :label="dadosEmpresa.empresaManutencao ? 'Suporte Técnico' : 'Cliente'"
                                    :color="dadosEmpresa.empresaManutencao ? 'blue' : 'white'"
                                />
                            </v-col>
                            
                            <v-col cols="12" md="1" class="d-flex align-center">
                                <v-switch
                                    :label="dadosEmpresa.ativo ? 'Ativo' : 'Inativo'"
                                    :color="dadosEmpresa.ativo ? 'blue' : 'white'"
                                    v-model="dadosEmpresa.ativo"
                                />
                            </v-col>

                        </v-row>

                    </v-form>

                    <!-- Acordeon com lista de colaboradores da empresa -->
                    <v-expansion-panels 
                        v-model="acordeonColaboradores" 
                        v-show="idEmpresaRecebido > 0"
                        id="acordeonColaboradores"
                    >

                        <v-expansion-panel>

                            <v-expansion-panel-title>
                                Colaboradores
                                <span v-if="totalColaboradores > 0" class="text-caption ml-2">
                                    ({{ totalColaboradores }})
                                </span>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>

                                <v-row class="mb-4" align="center" justify="end">

                                    <!-- Botão para criar novo colaborador -->
                                    <v-col cols="auto">
                                        <v-btn
                                            icon
                                            large
                                            class="rounded-button"
                                            style="background-color: #4CAF50;"
                                            @click="novoColaborador"
                                        >
                                            <v-icon color="white">mdi-plus</v-icon>
                                        </v-btn>
                                    </v-col>

                                </v-row>

                                <!-- Campo de busca colaboradores empresa -->
                                <v-text-field
                                    v-model="textoBuscaColaboradorEmpresa"
                                    label="Pesquisar"
                                    placeholder="Digite sua busca..."
                                    prepend-inner-icon="mdi-magnify"
                                    variant="outlined"
                                    clearable
                                    @keyup.enter="carregarListaColaboradoresEmpresa"
                                    @click:clear="carregarListaColaboradoresEmpresa"
                                    @update:modelValue="onBuscaColaboradorAtualizada"
                                />

                                <!-- Lista de colaboradores do modal de cadastro de empresas -->
                                <v-data-table-server
                                    item-value="idColaborador"
                                    v-model:options="opcoesTabelaColaboradoresEmpresa"
                                    :headers="headersColaboradores"
                                    :items="listaColaboradores"
                                    :loading="carregandoColaboradores"
                                    @update:options="carregarListaColaboradoresEmpresa"
                                    class="elevation-2 rounded-lg"
                                    density="compact"
                                    :items-length="totalColaboradores"
                                    :footer-props="{
                                        'items-per-page-text': 'Itens por página'
                                    }" 
                                    :style="{ 
                                        'font-family': 'Arial, sans-serif !important', 
                                        'font-size': '12px !important' 
                                    }"                                   
                                >
                                    
                                    <template v-slot:item.funcoes="{ item }">
                    
                                        <!-- Ícone de atalho para editar chamado -->
                                        <v-tooltip text="Editar Colaborador" location="bottom">
                                            <template #activator="{ props }">
                                                <v-icon
                                                    v-bind="props"
                                                    :color="item.ativo === 1 ? 'green' : 'red'" 
                                                    size="24" 
                                                    @click="editarColaboradorEmpresa(item.id)"
                                                    style="cursor: pointer; margin-right: 8px;"
                                                >
                                                mdi-pencil
                                                </v-icon>
                                            </template>
                                        </v-tooltip>
                                        
                                    </template>
                                    
                                    <!-- Coluna Condição (Ativo/Inativo) -->
                                    <template #item.ativo="{ item }">
                                        <span :class="item.ativo === 1 ? 'text-green' : 'text-red'">
                                        {{ item.ativo === 1 ? 'Ativo' : 'Inativo' }}
                                        </span>
                                    </template>
                                    
                                </v-data-table-server>

                            </v-expansion-panel-text>

                        </v-expansion-panel>

                    </v-expansion-panels>

                    <!-- Acordeon com lista de colaboradores da empresa -->
                    <v-expansion-panels 
                        v-model="acordeonProdutosEmpresa" 
                        v-show="idEmpresaRecebido > 0"
                        id="acordeonProdutosEmpresa"
                    >

                        <v-expansion-panel>

                            <v-expansion-panel-title>
                                Produtos
                                <span v-if="totalProdutosEmpresa > 0" class="text-caption ml-2">
                                    ({{ totalProdutosEmpresa }})
                                </span>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>

                                <v-row class="mb-4" align="center" justify="end">

                                    <!-- Botão para criar novo produto para a empresa -->
                                    <v-col cols="auto">
                                        <v-btn
                                            icon
                                            large
                                            class="rounded-button"
                                            style="background-color: #4CAF50;"
                                            @click="novoProdutoEmpresa"
                                        >
                                            <v-icon color="white">mdi-plus</v-icon>
                                        </v-btn>
                                    </v-col>

                                </v-row>

                                <!-- Campo de busca produtos empresa -->
                                <v-text-field
                                    v-model="textoBuscaProdutosEmpresa"
                                    label="Pesquisar"
                                    placeholder="Digite sua busca..."
                                    prepend-inner-icon="mdi-magnify"
                                    variant="outlined"
                                    clearable
                                    @keyup.enter="carregarListaProdutosEmpresa"
                                    @click:clear="carregarListaProdutosEmpresa"
                                    @update:modelValue="atualizaParamentrosBuscaProdutosEmpresa"
                                />

                                <!-- Lista de colaboradores do modal de cadastro de empresas -->
                                <v-data-table-server
                                    item-value="idProdutoEmpresa"
                                    v-model:options="opcoesTabelaProdutosEmpresa"
                                    :headers="headersProdutosEmpresa"
                                    :items="listaProdutosEmpresa"
                                    :loading="carregandoProdutosEmpresa"
                                    @update:options="carregarListaProdutosEmpresa"
                                    class="elevation-2 rounded-lg"
                                    :items-length="totalProdutosEmpresa"
                                    :footer-props="{
                                        'items-per-page-text': 'Itens por página'
                                    }" 
                                    :style="{ 
                                        'font-family': 'Arial, sans-serif !important', 
                                        'font-size': '12px !important' 
                                    }"                                    
                                >
                                    
                                    <template v-slot:item.funcoes="{ item }">
                    
                                        <!-- Ícone de atalho para editar produto -->
                                        <v-tooltip text="Editar Produto" location="bottom">
                                            <template #activator="{ props }">
                                                <v-icon
                                                    v-bind="props"
                                                    :color="item.ativo === 1 ? 'green' : 'red'" 
                                                    size="24" 
                                                    @click="editarProdutoEmpresa(item.id)"
                                                    style="cursor: pointer; margin-right: 8px;"
                                                >
                                                mdi-pencil
                                                </v-icon>
                                            </template>
                                        </v-tooltip>
                                        
                                    </template>
                                    
                                    <!-- Coluna Condição (Ativo/Inativo) -->
                                    <template #item.ativo="{ item }">
                                        <span :class="item.ativo === 1 ? 'text-green' : 'text-red'">
                                            {{ item.ativo === 1 ? 'Ativo' : 'Inativo' }}
                                        </span>
                                    </template>
                                    
                                </v-data-table-server>

                            </v-expansion-panel-text>

                        </v-expansion-panel>

                    </v-expansion-panels>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            class="ma-2"
                            style="background-color: orange; color: white;"
                             @click="$router.push({ name: 'ListaEmpresas' })"
                            >
                            <v-icon left>mdi-chevron-left</v-icon>
                            Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            style="background-color: #2196F3; color: white;"
                            @click="validarSalvarEmpresa('salvar')"
                            >
                            <v-icon left color="white">mdi-update</v-icon>
                            Salvar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid orange; color: orange;"
                            @click="validarSalvarEmpresa('salvar-retornar')"
                            >
                            <v-icon left color="orange">mdi-update</v-icon>
                            Salvar e Retornar
                        </v-btn>

                        <v-btn
                            class="ma-2"
                            outlined
                            style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                            @click="validarSalvarEmpresa('salvar-novo')"
                            >
                            <v-icon left color="#2196F3">mdi-autorenew</v-icon>
                            Salvar e Novo
                        </v-btn>

                    </v-card-actions>
                    
                </v-card>

            </v-container>

        </v-main>

    </v-app>

    <!-- Modal cadastro de colaboradores -->
    <v-dialog v-model="modalDadosColaboradorEmpresa.visible" max-width="80%" persistent>

        <!-- Card que contém os dados do chamado e só é mostrado quando existem dados na variável modalDadosChamado -->
        <v-card>
            
            <!-- Mostra o título do modal e o código do chamado -->
            <v-card-title>Cadastro Colaboradores</v-card-title>

            <v-card-text>

                <!-- Formulário para editar os dados do chamado -->
                <v-form ref="formCadastroColaboradorEmpresa" v-model="validaCadastroColaborador">

                    <v-row dense>

                        <!-- Campo nome do departamento -->
                        <v-col cols="12" sm="3">
                            <v-text-field 
                                label="Departamento" 
                                :model-value="modalDadosColaboradorEmpresa.data.departamento"
                                @update:model-value="modalDadosColaboradorEmpresa.data.departamento = $event.toUpperCase()"
                                maxlength="45"
                                :rules="[rules.required]"                  
                            />                            
                        </v-col>

                        <!-- Campo nome do colaborador -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="Nome" 
                                :model-value="modalDadosColaboradorEmpresa.data.nome" 
                                @update:model-value="modalDadosColaboradorEmpresa.data.nome = $event.toUpperCase()"
                                maxlength="255"
                                :rules="[rules.required]"
                                v-uppercase
                            />                            
                        </v-col>

                        <!-- Campo login do colaborador -->
                        <v-col cols="12" sm="3">
                            <v-text-field 
                                label="Login" 
                                v-model="modalDadosColaboradorEmpresa.data.login" 
                                maxlength="255"
                                :rules="[rules.required]"
                            />                            
                        </v-col>

                        <!-- Campo sexo do colaborador -->
                        <v-col cols="12" sm="2">
                            
                            <v-select
                                v-model="modalDadosColaboradorEmpresa.data.sexo"
                                :items="[
                                    { label: 'M', value: 0 },
                                    { label: 'F', value: 1 }
                                ]"
                                item-title="label"
                                item-value="value"
                                label="Sexo"
                                :rules="[rules.required]"
                            />

                        </v-col>
                        
                        <!-- Campo senha do colaborador -->
                        <v-col cols="12" sm="6">

                            <v-text-field
                                v-model="modalDadosColaboradorEmpresa.data.senha"
                                :type="mostrarSenha ? 'text' : 'password'"
                                label="Senha"
                                :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="mostrarSenha = !mostrarSenha"
                                maxlength="32"
                                clearable
                            />

                        </v-col>

                        <!-- Campo conferência de senha do colaborador -->
                        <v-col cols="12" sm="6">

                            <v-text-field
                                v-model="modalDadosColaboradorEmpresa.data.confereSenha"
                                :type="mostrarSenha ? 'text' : 'password'"
                                label="Digite Novamente a Senha"
                                :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="mostrarSenha = !mostrarSenha"
                                maxlength="32"
                                clearable
                            />

                        </v-col>

                        <!-- Campo cargo do colaborador -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="Cargo" 
                                :model-value="modalDadosColaboradorEmpresa.data.cargo" 
                                @update:model-value="modalDadosColaboradorEmpresa.data.cargo = $event.toUpperCase()"
                                maxlength="255"
                                :rules="[rules.required]"
                                v-uppercase                                
                            />                            
                        </v-col>

                        <!-- Campo email do colaborador -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="E-mail" 
                                v-model="modalDadosColaboradorEmpresa.data.email" 
                                maxlength="255"
                            />                            
                        </v-col>

                        <!-- Campo telefone do colaborador -->
                        <v-col cols="12" sm="3">
                            <v-text-field 
                                label="Telefone" 
                                v-model="modalDadosColaboradorEmpresa.data.telefone" 
                                maxlength="255"
                                v-numerico                                
                            />                            
                        </v-col>

                        <v-col cols="12" sm="1">
                            
                            <v-switch
                                v-model="modalDadosColaboradorEmpresa.data.ativo"
                                :label="modalDadosColaboradorEmpresa.data.ativo ? 'Ativo' : 'Inativo'"
                                :color="modalDadosColaboradorEmpresa.data.ativo ? 'blue' : 'grey'"                                
                            />

                        </v-col>

                        <!-- Empresa de manutenção -->
                        <v-col cols="12" sm="12">
                            
                            <div v-if="dadosEmpresa.empresaManutencao">
                                <v-text-field
                                    v-model="modalDadosColaboradorEmpresa.data.valorHora"
                                    label="Valor Hora"
                                    @input="formatarValor"
                                    maxlength="15"
                                    clearable
                                />
                            </div>

                        </v-col>
                        
                    </v-row>

                </v-form>

            </v-card-text>
            
            <v-card-actions>

                <v-spacer />
                <v-btn
                    class="ma-2"
                    style="background-color: orange; color: white;"
                    @click="fecharModalColaborador"
                    >
                    <v-icon left>mdi-chevron-left</v-icon>
                    Retornar
                </v-btn>

                <v-btn
                    class="ma-2"
                    style="background-color: #2196F3; color: white;"
                    @click="validarSalvarColaborador('salvar')"
                    >
                    <v-icon left color="white">mdi-update</v-icon>
                    Salvar
                </v-btn>

                <v-btn
                    class="ma-2"
                    outlined
                    style="background-color: white; border: 2px solid orange; color: orange;"
                    @click="validarSalvarColaborador('salvar-retornar')"
                    >
                    <v-icon left color="orange">mdi-update</v-icon>
                    Salvar e Retornar
                </v-btn>

                <v-btn
                    class="ma-2"
                    outlined
                    style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                    @click="validarSalvarColaborador('salvar-novo')"
                    >
                    <v-icon left color="#2196F3">mdi-autorenew</v-icon>
                    Salvar e Novo
                </v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>

    <!-- Modal cadastro de colaboradores -->
    <v-dialog v-model="modalDadosProdutoEmpresa.visible" max-width="80%" persistent>

        <!-- Card que contém os dados do chamado e só é mostrado quando existem dados na variável modalDadosChamado -->
        <v-card>
            
            <!-- Mostra o título do modal e o código do chamado -->
            <v-card-title>Produtos Empresa</v-card-title>

            <v-card-text>

                <!-- Formulário para editar os dados do chamado -->
                <v-form ref="formCadastroProdutoEmpresa" v-model="validaCadastroProdutoEmpresa">

                    <v-row dense>

                        <v-col cols="12" sm="11">

                            <!-- Select que mostra a lista de produtos. Seleciona o produto apontado por idProdutos -->
                            <v-select
                                v-model="modalDadosProdutoEmpresa.data.idProdutoEmpresa"
                                :items="modalDadosProdutoEmpresa.data.produtoEmpresa"
                                label="Produto"
                                item-title="title"
                                item-value="value"
                                @update:modelValue="buscarPrecoProduto"
                                clearable                                
                            ></v-select>
                        
                        </v-col>                        
                        
                        <v-col cols="12" md="1" class="d-flex align-center">
                            <v-switch
                                v-model="modalDadosProdutoEmpresa.data.ativo"
                                :label="modalDadosProdutoEmpresa.data.ativo ? 'Ativo' : 'Inativo'"
                                :color="modalDadosProdutoEmpresa.data.ativo ? 'blue' : 'white'"                                
                            />
                        </v-col>

                        <!-- Campo precoLicenca -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="Preço Tabela" 
                                v-model="modalDadosProdutoEmpresa.data.precoTabela" 
                                maxlength="11"
                                :rules="[rules.required]"                                
                                placeholder="0,00"
                                type="text"
                                variant="filled"
                                @input="(e) => formatarCusto(e, 'precoTabela')"
                                @blur="calcularPrecoTotal"
                            />                            
                        </v-col>

                        <!-- Campo quantidadeLicencas -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="Quantidade Licenças" 
                                v-model="modalDadosProdutoEmpresa.data.quantidadeLicencas" 
                                maxlength="4"
                                :rules="[rules.required]"
                                v-uppercase
                                @blur="calcularPrecoTotal"
                            />                            
                        </v-col>

                        <!-- Campo precoTotal -->
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                label="Preço Total" 
                                v-model="modalDadosProdutoEmpresa.data.precoTotal" 
                                maxlength="13"
                                :rules="[rules.required]"
                                placeholder="0,00"
                                type="text"
                                variant="filled"
                                @input="(e) => formatarCusto(e, 'precoTotal')"
                            />                            
                        </v-col>

                    </v-row>

                </v-form>

            </v-card-text>
            
            <v-card-actions>

                <v-spacer />
                <v-btn
                    class="ma-2"
                    style="background-color: orange; color: white;"
                    @click="fecharModalProdutoEmpresa"
                    >
                    <v-icon left>mdi-chevron-left</v-icon>
                    Retornar
                </v-btn>

                <v-btn
                    class="ma-2"
                    style="background-color: #2196F3; color: white;"
                    @click="validarSalvarProdutoEmpresa('salvar')"
                    >
                    <v-icon left color="white">mdi-update</v-icon>
                    Salvar
                </v-btn>

                <v-btn
                    class="ma-2"
                    outlined
                    style="background-color: white; border: 2px solid orange; color: orange;"
                    @click="validarSalvarProdutoEmpresa('salvar-retornar')"
                    >
                    <v-icon left color="orange">mdi-update</v-icon>
                    Salvar e Retornar
                </v-btn>

                <v-btn
                    class="ma-2"
                    outlined
                    style="background-color: white; border: 2px solid #2196F3; color: #2196F3;"
                    @click="validarSalvarProdutoEmpresa('salvar-novo')"
                    >
                    <v-icon left color="#2196F3">mdi-autorenew</v-icon>
                    Salvar e Novo
                </v-btn>

            </v-card-actions>

        </v-card>

    </v-dialog>

</template>

<script setup>

    /* DEPENDENCIAS E VARIAVEIS COMUNS */
    import { ref, watch, onMounted, computed } from 'vue'
    import axios from 'axios'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    // Carrega o endereço das ap
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Importa o componente do formulário de erros
    import { useErroStore } from '@/stores/erroStore'

    // Importa o componente do Snackbar
    import { useSnackbarStore } from '@/stores/snackbar'

    // Retorna um objeto com informações internas sobre o componente que está sendo executado no momento    
    import { getCurrentInstance } from 'vue'

    // Importa o componente do formulário de login
    import { useLoginStore } from '@/stores/loginStore'

    // Importa useRouter para acessar parâmetros de rota
    import { useRouter } from 'vue-router'

    // Importa módulo que controla as autorizacoes se está logado ou não
    import { useAuthStore } from '@/stores/authStore'

    // Importa useRoute para acessar parâmetros de rota
    import { useRoute } from 'vue-router'

    // Importando como módulo padrão (se for export default)
    import { useSenhaStore } from '../stores/senhaStore';

    // Inicializa o store
    const senhaStore = useSenhaStore();

    // Importa a store de erros
    const erroStore = useErroStore()

    // Importa a store do snackbar
    const snackbar = useSnackbarStore()

    // Permite acessar rotinas globais
    const { proxy } = getCurrentInstance()

    // Importa a store de chamados
    const loginStore = useLoginStore()

    // Acessa o ID da empresa via query param
    const router = useRouter();

    // Cria variável que receberão os dados das autorizações de login
    const autorizacaoLogin = useAuthStore()

    // Acessa o ID da empresa via query param
    const route = useRoute(); 

    
    /* VARIAVEIS DO FORMULÁRIO */
    
    // Variável para armazenar o ID da empresa (0 para nova empresa)
    const idEmpresaRecebido = ref(0);

    // Salva o id da empresa
    idEmpresaRecebido.value = Number(route.query.idEmpresa) || 0;
    
    // Define variável para armazenar listas de ramos de atividade e status de crédito
    const listaRamosAtividade = ref([])
    const listaStatusCredito = ref([])
        
    // Define a variável para mostrar ou esconder a senha
    const mostrarSenha = ref(false)
    
    // Validação do formulário de empresa
    const validaCadastroEmpresa = ref(false)

    // Validação do fomrulário colaborador
    const validaCadastroColaborador = ref(false)

    // Validação do fomrulário colaborador
    const validaCadastroProdutoEmpresa = ref(false)
    
    // Referência do formulário de cadastro de empresa
    const formCadastroEmpresa = ref(null)

    // Referência do formulário de cadastro de colaborador
    const formCadastroColaboradorEmpresa = ref(null)

    // Referência do formulário de cadastro de colaborador
    const formCadastroProdutoEmpresa = ref(null)

    // Cria uma referencia para enviar o foco ao campo cnpj
    const focoCNPJ = ref(null)

    // Cria uma referencia para enviar o foco ao campo número
    const focoNumero = ref(null)

    // Dados da empresa
    const dadosEmpresa = ref({
        nomeFantasia: '',
        razaoSocial: '',
        apelido: '',
        cnpj: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        idRamoAtividade: [],
        idStatusCredito: [],
        urlSite: '',
        emailPrincipal: '',
        fonePrincipal: '',
        pais: '',        
        cep: '',
        uf: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: '',
        empresaManutencao: false,
        ativo: true
    })
    
    // Dados do modal dos colaboradores da empresa 
    const modalDadosColaboradorEmpresa = ref({
        visible: false,
        data:{
            id: 0,
            idEmpresa: idEmpresaRecebido.value,
            departamento: '',
            nome: '',
            login: '',
            senha: '',
            confereSenha: '',
            cargo: '',  
            sexo: '',
            email: '',
            telefone: '',
            valorHora: 0,
            ativo: true
        }
    })

    // Dados do modal dos produtos da empresa 
    const modalDadosProdutoEmpresa = ref({
        visible: false,
        data:{
            id: 0,
            idEmpresa: idEmpresaRecebido.value,
            idProdutoEmpresa: [],
            produtoEmpresa: [],
            precoTabela: '',
            quantidadeLicencas: '',
            precoTotal: '',
            ativo: true
        }
    })

    // Define arrays e variáveis para a tabela de colaboradores
    const listaColaboradores = ref([])
    const totalColaboradores = ref(0)
    const carregandoColaboradores = ref(false)
    const textoBuscaColaboradorEmpresa = ref('')
    const acordeonColaboradores = ref([])
    
    const listaProdutosEmpresa = ref([])
    const totalProdutosEmpresa = ref(0)
    const carregandoProdutosEmpresa = ref(false)
    const textoBuscaProdutosEmpresa = ref('')
    const acordeonProdutosEmpresa = ref([])
    
    // Opções buscar colaboradores
    const opcoesTabelaColaboradoresEmpresa = ref({
        page: 1,
        itemsPerPage: 10,
        sortBy: [{ key: 'nome', order: 'asc' }]
    })

    // Opções buscar produtos empresa
    const opcoesTabelaProdutosEmpresa = ref({
        page: 1,
        itemsPerPage: 10,
        sortBy: [{ key: 'nome', order: 'asc' }]
    })

    // Define os headers da tabela de colaboradores
    const headersColaboradores = [
        { title: 'Editar', value: 'funcoes', sortable: false },
        { title: 'Código', key: 'id', sortable: true },
        { title: 'Nome', key: 'nome', sortable: true },
        { title: 'Login', key: 'login', sortable: true },
        { title: 'Departamento', key: 'departamento', sortable: true },
        { title: 'Cargo', key: 'cargo', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'Fone', key: 'whatsapp', sortable: true },
        { title: 'Condição', value: 'ativo', sortable: true}
    ]

    // Define os headers da tabela de produtos da empresa
    const headersProdutosEmpresa = [
        { title: 'Editar', value: 'funcoes', sortable: false },
        { title: 'Código', key: 'id', sortable: true },
        { title: 'Produto', key: 'nome', sortable: true },
        { title: 'Preço Tabela', key: 'precoTabela', sortable: true },
        { title: 'Licenças', key: 'quantidadeLicencas', sortable: true },
        { title: 'Preço Total', key: 'precoTotal', sortable: true },
        { title: 'Condição', value: 'ativo', sortable: true}
    ]

    // Esta rotina é chamada pelo botão para cadastrar um novo colaborador na empresa
    const novoColaborador = () => {
        
        // Define os dados iniciais do novo colaborador
        modalDadosColaboradorEmpresa.value = {
            visible: true,
            modo: 'novo',
            data: {
                id: 0,
                idEmpresa: idEmpresaRecebido.value,
                departamento: '',
                nome: '',
                login: '',
                senha: '',
                confereSenha: '',
                cargo: '',  
                sexo: '',
                email: '',
                telefone: '',
                valorHora: 0,
                ativo: true
            }
        };         
    }

    // Esta rotina é chamada pelo botão para cadastrar um novo produto na empresa
    async function novoProdutoEmpresa(){

        // Limpa dados do formulário
        limpaModalDadosProdutoEmpresa()
        
        try{

            // Carrega todos produtos
            const { data: dataProdutos } = await axios.get(`${API_BASE_URL}/administracao/carregaListaProdutos`)

            // Garante que temos um array válido de produtos
            const produtos = Array.isArray(dataProdutos.data) 
                ? dataProdutos.data 
                : dataProdutos.data || []

            // Filtra produtos ativos e depois mapeia
            modalDadosProdutoEmpresa.value.data.produtoEmpresa = produtos
                .filter(produto => produto.ativo === 1)
                .map(produto => ({
                    value: produto.idProduto,
                    title: produto.nome,
                    precoTabela: produto.precoTabela
                })
            )
           
            modalDadosProdutoEmpresa.value.visible = true

        } catch(erro){
            erroStore.exibirErro(erro)
        }        
    }

    // Regras de validação
    const rules = {
        required: v => v !== null && v !== undefined && v !== '' || 'Campo obrigatório',
        cnpj: v => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v) || 'CNPJ inválido'
    }

    // Rotina chamada quando o componente é montado
    onMounted(async () => {

        try {
            
            // Verifica se não está logado
            if (!autorizacaoLogin.estaLogado){
            
                // Carrega formulário de login
                router.push({ name: 'Login' })
                return
            }

            // Busca todos ramos de atividade
            const ramosAtividade = await axios.get(`${API_BASE_URL}/administracao/carregaListaRamosAtividade`)
            
            // Filtra apenas os ativos, se necessário
            listaRamosAtividade.value = ramosAtividade.data.data.filter(r => r.ativo === 1)

            // Busca todos status de crédito
            const statusCredito = await axios.get(`${API_BASE_URL}/administracao/carregaListaStatusCredito`)
            
            // Filtra apenas os ativos, se necessário
            listaStatusCredito.value = statusCredito.data.data.filter(r => r.ativo === 1)

            // Verifica se foi recebid idEmpresaRecebido para carregar os dados da empresa
            if (idEmpresaRecebido.value != 0){

                // Busca dados da empresa pelo ID
                const { data: dadosRecebidos } = await axios.get(`${API_BASE_URL}/administracao/carregaEmpresa/${idEmpresaRecebido.value}`)
                    
                // Converte os campos empresa manutenção e ativo para booleanos
                dadosEmpresa.empresaManutencao = dadosEmpresa.empresaManutencao === 1;
                dadosEmpresa.ativo = dadosEmpresa.ativo === 1;

                // Atribui os dados da empresa à variável reativa dadosEmpresa
                dadosEmpresa.value = dadosRecebidos;
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        }        
    })

    // Observa mudanças no acordeão para carregar colaboradores quando aberto
    watch(acordeonColaboradores, (val) => {
        
        if (Array.isArray(val)) {
            
            if (val.includes(0)) {
                carregarListaColaboradoresEmpresa()
            }
            
        } else if (val === 0) {
            carregarListaColaboradoresEmpresa()
        } else {
            totalColaboradores.value = 0
        }
    })

    // Observa mudanças no acordeão para carregar colaboradores quando aberto
    watch(acordeonProdutosEmpresa, (val) => {
        
        if (Array.isArray(val)) {
            
            if (val.includes(0)) {
                carregarListaProdutosEmpresa()
            }
            
        } else if (val === 0) {
            carregarListaProdutosEmpresa()
        } else {
            totalProdutosEmpresa.value = 0
        }
    })

    // Calcula preço toda dos produtos
    const calcularPrecoTotal = () => {
        
        // Remove R$, espaços, e formata para número
        const precoString = modalDadosProdutoEmpresa.value.data.precoTabela
            ?.toString()
            .replace(/R\$/g, '')         // Remove "R$"
            .replace(/\s/g, '')          // Remove espaços
            .trim();                     // Remove espaços no início/fim

        const precoLicencaCalculo = parseFloat(
            precoString
                .replace(/\./g, '')      // Remove pontos (separadores de milhar)
                .replace(',', '.')       // Substitui vírgula por ponto (decimal)
        ) || 0;
        
        // Busca quantidade de produtos
        const quantidade = parseInt(modalDadosProdutoEmpresa.value.data.quantidadeLicencas) || 0;
        
        // Multiplica o preço de tabela pela quantidade
        const precoTotal = precoLicencaCalculo * quantidade;
        
        // Formata como moeda brasileira
        const formatador = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        // Mostra o valor calculado no campo preço total
        modalDadosProdutoEmpresa.value.data.precoTotal = formatador.format(precoTotal);
    }

    // Função para carregar os colaboradores da empresa
    const carregarListaColaboradoresEmpresa = async () => {

        // Extrai parâmetros de forma segura e correta
        const opcoes = opcoesTabelaColaboradoresEmpresa.value

        // Ordenação - forma correta para Vuetify 3
        let ordenacaoPor = 'nome'
        let direcaoOrdenacao = 'asc'

        if (opcoes.sortBy && opcoes.sortBy.length > 0) {
            ordenacaoPor = opcoes.sortBy[0].key
            direcaoOrdenacao = opcoes.sortBy[0].order
        }
        
        // Paginação
        const paginaAtual = opcoes.page || 1
        const itensPorPagina = opcoes.itemsPerPage || 10

        // Limpa a lista de colaboradores
        listaColaboradores.value = []
        totalColaboradores.value = 0

        // Limpa a lista de colaboradores
        listaColaboradores.value = []

        // Reseta o total de colaboradores
        totalColaboradores.value = 0

        try {

            // Verifica se já está em processo de carregamento
            if (carregandoColaboradores.value == false){

                // Liga indicação de carga dos colaboradores
                carregandoColaboradores.value = true
        
                // Chama a API para buscar os colaboradores da empresa
                const response = await axios.get(`${API_BASE_URL}/administracao/carregaListaColaboradores/${idEmpresaRecebido.value}`, { 
                    params:{
                        textoBuscaColaboradorEmpresa: textoBuscaColaboradorEmpresa.value,
                        ordenacaoPor: ordenacaoPor || 'nome',  
                        direcaoOrdenacao: direcaoOrdenacao || 'asc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina
                    } 
                })

                // Atualiza os dados dos colaboradores e o total
                listaColaboradores.value = response.data.data

                // Salva total de 
                totalColaboradores.value = response.data.total

                // Desliga indicação de carga dos colaboradores
                carregandoColaboradores.value = false        
            }

        } catch (erro) {

            // Desliga indicação de carga dos colaboradores
            carregandoColaboradores.value = false  

            // Usa a store de erros para exibir o erro
            erroStore.exibirErro(erro)

        } finally {
            carregandoColaboradores.value = false
        }
    }

    // Função para carregar os colaboradores da empresa
    const carregarListaProdutosEmpresa = async () => {
        
        // Extrai parâmetros de forma segura e correta
        const opcoes = opcoesTabelaProdutosEmpresa.value

        // Ordenação - forma correta para Vuetify 3
        let ordenacaoPor = 'nome'
        let direcaoOrdenacao = 'asc'

        if (opcoes.sortBy && opcoes.sortBy.length > 0) {
            ordenacaoPor = opcoes.sortBy[0].key
            direcaoOrdenacao = opcoes.sortBy[0].order
        }
        
        // Paginação
        const paginaAtual = opcoes.page || 1
        const itensPorPagina = opcoes.itemsPerPage || 10

        // Limpa a lista de colaboradores
        listaProdutosEmpresa.value = []

        // Reseta o total de colaboradores
        totalProdutosEmpresa.value = 0

        try {

            // Verifica se já está carregando produtos da empresa
            if (carregandoProdutosEmpresa.value == false){
           
                // Sinaliza carga dos produtos da empresa
                carregandoProdutosEmpresa.value = true

                // Chama a API para buscar os colaboradores da empresa
                const response = await axios.get(`${API_BASE_URL}/administracao/carregaListaProdutosEmpresa/${idEmpresaRecebido.value}`, { 
                    params:{
                        textoBuscaProdutosEmpresa: textoBuscaProdutosEmpresa.value,
                        ordenacaoPor: ordenacaoPor || 'nome',  
                        direcaoOrdenacao: direcaoOrdenacao || 'asc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina
                    } 
                })

                // Formata os campos de valor monetário para padrão brasileiro
                const listaFormatada = response.data.data.map(item => ({
                    ...item,
                    precoTabela: proxy.$formatarValorParaReal(item.precoTabela),
                    precoTotal: proxy.$formatarValorParaReal(item.precoTotal)
                }))

                // Agora atribui à sua lista reativa
                listaProdutosEmpresa.value = listaFormatada

                // Salva total de registros para mostrar na tabela
                totalProdutosEmpresa.value = response.data.total

                // Sinaliza que os produtos da empresa foram carregados
                carregandoProdutosEmpresa.value = false
            }

        } catch (erro) {

            // Sinaliza que os produtos da empresa foram carregados
            carregandoProdutosEmpresa.value = false

            // Usa a store de erros para exibir o erro
            erroStore.exibirErro(erro)

        } finally {
            carregandoProdutosEmpresa.value = false
        }
    }

    // Esta função é chamada ao se digitar o custo de do chamado para formatar o valor em BR
    const formatarCusto = (event, campo) => {
        
        // Busca valor digitado
        const valorDigitado = event.target.value
        
        // Formata valor
        const valorFormatado = proxy.$formatarDinheiro(valorDigitado)

        if (campo === 'precoTabela') {
            modalDadosProdutoEmpresa.value.data.precoTabela = valorFormatado
        } else if (campo === 'precoTotal') {
            modalDadosProdutoEmpresa.value.data.precoTotal = valorFormatado
        }        
    }

    // Limpa dados do formulário modal colaborador empresa
    const limpaModalDadosColaboradorEmpresa = () => {

        modalDadosColaboradorEmpresa.value = {
            modo: 'novo',
            data: {
                id: 0,
                idEmpresa: idEmpresaRecebido.value,
                departamento: '',
                nome: '',
                login: '',
                senha: '',
                confereSenha: '',
                cargo: '',  
                sexo: '',
                email: '',
                telefone: '',
                valorHora: 0,
                ativo: true
            }
        }
    }

    // Função para buscar o preço quando um produto é selecionado
    const buscarPrecoProduto = (idProdutoSelecionado) => {

        // Se não recebeu o idProdutoSelecionado sai da rotina
        if (!idProdutoSelecionado) return
        
        // Encontra o produto selecionado no array
        const produtoSelecionado = modalDadosProdutoEmpresa.value.data.produtoEmpresa
            .find(produto => produto.value === idProdutoSelecionado)
        
        // Se encontrou o produto, atualiza o preço
        if (produtoSelecionado) {

            modalDadosProdutoEmpresa.value.data.precoTabela = produtoSelecionado.precoTabela.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Calcula o preço total do produto selecionado
            calcularPrecoTotal()            
        }        
    }

    // Limpa campos do cadastro de empresas
    function limpaDadosEmpresa(){

        dadosEmpresa.value = {
            modo: 'novo',
            data: {
                nomeFantasia: '',
                razaoSocial: '',
                apelido: '',
                cnpj: '',
                inscricaoEstadual: '',
                inscricaoMunicipal: '',
                idRamoAtividade: [],
                idStatusCredito: [],
                urlSite: '',
                emailPrincipal: '',        
                fonePrincipal: '',
                pais: '',        
                cep: '',
                uf: '',
                cidade: '',
                bairro: '',
                logradouro: '',
                numero: '',
                complemento: '',
                empresaManutencao: false,
                ativo: true
            }
        } 
        
        // Limpa id da empresa recebido da lista
        idEmpresaRecebido.value = 0;
    }

    // Limpa dados do formulário modal produtos empresa
    function limpaModalDadosProdutoEmpresa(){

        Object.assign(modalDadosProdutoEmpresa.value.data, {
            id: 0,
            idEmpresa: idEmpresaRecebido.value,
            idProdutoEmpresa: [],
            produtoEmpresa: [],
            precoTabela: '',
            quantidadeLicencas: '',
            precoTotal: '',
            ativo: true
        })

        modalDadosProdutoEmpresa.value.visible = true
    }

    // Fecha modal do cadastro de colaboradores
    function fecharModalColaborador(){

        // Torna modal invisível
        modalDadosColaboradorEmpresa.value.visible = false
        
        // Limpa dados do modal
        limpaModalDadosColaboradorEmpresa()
    }

    // Fecha modal do cadastro de colaboradores
    function fecharModalProdutoEmpresa(){

        // Limpa dados do modal
        limpaModalDadosProdutoEmpresa()
        
        // Torna modal invisível
        modalDadosProdutoEmpresa.value.visible = false 
    }

    // Se o campo foi limpo, recarrega a lista de colaboradores        
    function onBuscaColaboradorAtualizada(novoValor) {
        if (!novoValor) {
            carregarListaColaboradoresEmpresa()
        }
    }

    // Se o campo foi limpo, recarrega a lista de produtos
    function atualizaParamentrosBuscaProdutosEmpresa(novoValor){
        if (!novoValor){
            carregarListaProdutosEmpresa()
        }
    }

    // Função simples para formatar como moeda
    function formatarValor(event) {

        // Busca valor digitado no elemento
        const valorBruto = event.target.value.replace(/\D/g, '');

        // Verifica se recebeu valor bruto
        if (!valorBruto) {
            modalDadosColaboradorEmpresa.value.data.valorHora = '';
            return;
        }

        // Converte o valor digitado para começar pelas centenas
        const valorConvertido = parseFloat(valorBruto) / 100;
        
        // Mostra o valor convertido com a mascara para brasil
        modalDadosColaboradorEmpresa.value.data.valorHora = valorConvertido.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Esta função valida o campo cnpj
    function validarCnpj(cnpj){

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14) {
            
            snackbar.trigger('CNPJ Inválido. Deve Conter 14 Digitos', 'error');
            focoCNPJ.value.focus()
            return false;
        }

        // Elimina CNPJs inválidos conhecidos
        if (/^(\d)\1+$/.test(cnpj)) {
            
            snackbar.trigger('CNPJ Inválido.', 'error');
            focoCNPJ.value.focus()
            return false;
        }

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) {

            snackbar.trigger('CNPJ Inválido.', 'error');
            focoCNPJ.value.focus()
            return false;
        }

        tamanho += 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    }

    // Função para buscar o endereço pelo CEP usando a API do ViaCEP
    function buscaCep(cep) {

        // Remove qualquer caracter que não seja número
        const cepLimpo = cep.replace(/\D/g, '');

        // Verifica se o CEP possui 8 dígitos
        if (cepLimpo.length === 8) {
            
            // Chama a API do ViaCEP para buscar os dados do endereço
            axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`).then(response => {
                
                const dados = response.data;
                    
                if (!dados.erro) {
                
                    // Preenche os campos do endereço com os dados retornados                
                    dadosEmpresa.value.logradouro = dados.logradouro.toUpperCase();                
                    dadosEmpresa.value.bairro = dados.bairro.toUpperCase();                
                    dadosEmpresa.value.cidade = dados.localidade.toUpperCase();                
                    dadosEmpresa.value.uf = dados.uf.toUpperCase();                
                    dadosEmpresa.value.pais = 'BRASIL';

                    focoNumero.value.focus()
                
                } else {
                
                    // CEP não encontrado
                    snackbar.trigger('CEP não encontrado.', 'error');
                }
                
            }).catch(erro => {                
                erroStore.exibirErro(erro)
            });
        
        } else {

            // CEP inválido
            snackbar.trigger('CEP inválido. Deve conter 8 dígitos.', 'error');            
        }
    }

    // Busca dados do colaborador e mostra em um formulário modal
    async function editarColaboradorEmpresa(idColaborador){

        try{

            // Limpa dados do formulário        
            limpaModalDadosColaboradorEmpresa()

            // Busca os dados do chamado específico por idChamado
            const { data: respostaApi } = await axios.get(`${API_BASE_URL}/administracao/carregaColaborador/${idColaborador}`)
            
            // Verifica se retornou dados da API
            if (respostaApi) {

                // Converte os campos TINYINT(1) para booleanos
                respostaApi.data.ativo = respostaApi.data.ativo === 1;
                
                // Salva os dados do colaborador retornados pela api
                modalDadosColaboradorEmpresa.value = {
                    visible: true,
                    modo: 'edicao',
                    data: {
                        ...respostaApi.data,
                        sexo: Number(respostaApi.data.sexo)
                    }
                }
                
                // Mostra o valor hora técnica do colaborador
                modalDadosColaboradorEmpresa.value.data.valorHora = Number(respostaApi.data.valorHora).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

            } else {
                erroStore.exibirErro('Colaborador não encontrado')
            }

        } catch(erro){            
            erroStore.exibirErro(erro)
        }
    }
    
    // Busca dados do colaborador e mostra em um formulário modal
    async function editarProdutoEmpresa(idProduto){

        try{

            // Limpa dados do formulário        
            limpaModalDadosProdutoEmpresa()

            // Carrega todos produtos
            const { data: dataProdutos } = await axios.get(`${API_BASE_URL}/administracao/carregaListaProdutos`)
            
            // Garante que temos um array válido de produtos
            const produtos = Array.isArray(dataProdutos.data) 
                ? dataProdutos.data 
                : dataProdutos.data || []

            // Filtra apenas produtos ativos (ativo = 1)
            const produtosAtivos = produtos.filter(produto => produto.ativo === 1)

            // Carrega os produtos ATIVOS no formato que o v-select precisa
            modalDadosProdutoEmpresa.value.data.produtoEmpresa = produtosAtivos.map(produto => ({
                value: produto.idProduto,
                title: produto.nome
            }))

            // Busca os produtos da empresa
            const { data: respostaApi } = await axios.get(`${API_BASE_URL}/administracao/carregaProdutoEmpresa/${idProduto}`)
            
            // Verifica se retornou dados da API
            if (respostaApi) {

                // Carrega o id do produto empresa
                modalDadosProdutoEmpresa.value.data.id = respostaApi.data.id
                
                // Converte o campo TINYINT(1) ativo para booleano
                modalDadosProdutoEmpresa.value.data.ativo = respostaApi.data.ativo == 1 ? true : false

                // Aponta para o produto selecionado
                modalDadosProdutoEmpresa.value.data.idProdutoEmpresa = respostaApi.data.idProdutoEmpresa
                
                // Carrega os dados do modal Produtos Empresa
                modalDadosProdutoEmpresa.value.data.quantidadeLicencas = respostaApi.data.quantidadeLicencas
                
                // Carrega o preço de tabela licença
                modalDadosProdutoEmpresa.value.data.precoTabela = Number(respostaApi.data.precoTabela).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Carrega o preço total
                modalDadosProdutoEmpresa.value.data.precoTotal = Number(respostaApi.data.precoTotal).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Mostra modal de produtos da empresa
                modalDadosProdutoEmpresa.value.visible = true

            } else {
                erroStore.exibirErro('Colaborador não encontrado')
            }

        } catch(erro){            
            erroStore.exibirErro(erro)
        }
    }

    // Regra personalizada para validar campos
    async function validarSalvarEmpresa(funcaoRetorno) {
        
        // Valida o formulário de empresa
        const isValid = await formCadastroEmpresa.value?.validate()

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid) {

            // Chama a função para salvar os dados da empresa
            salvarDadosEmpresa(funcaoRetorno)

        } else {            
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');
        }
    }

    // Esta função salva ou edita os dados de uma empresa
    async function salvarDadosEmpresa(funcaoRetorno) {

        try {
            
            // Se a variável urlSite não possuir especificação http insere
            if (!dadosEmpresa.value.urlSite.startsWith('http')) {
                dadosEmpresa.value.urlSite = 'https://' + dadosEmpresa.value.urlSite
            }

            // Busca o ID da empresa para saber se é inclusão ou edição
            const {data: resposta } = await axios.post(`${API_BASE_URL}/administracao/salvaEmpresa/${idEmpresaRecebido.value}`, dadosEmpresa.value)
            
            // Atualiza o idEmpresa com o valor retornado da API
            idEmpresaRecebido.value = resposta.idEmpresa;

            // Exibe mensagem de sucesso
            snackbar.trigger('Empresa Salva Com Sucesso.', 'success');

            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                router.push({ name: 'ListaEmpresas' })
            } else {
                limpaDadosEmpresa()
            }

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    } 
    
    // Regra personalizada para validar campos
    async function validarSalvarColaborador(funcaoRetorno) {
        
        // Valida o formulário de colaborador
        const isValid = await formCadastroColaboradorEmpresa.value?.validate()

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid) {

            // Chama a função para salvar os dados do colaborador
            salvarDadosColaboradorEmpresa(funcaoRetorno)

        } else {
            
            // Exibe mensagem de sucesso
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');            
        }
    }

    // Esta função salva os dados do colaborador da empresa selecionada
    async function salvarDadosColaboradorEmpresa(funcaoRetorno) {

        try{
        
            // Valida a senha informada se estiver criando um novo colaborador
            if (modalDadosColaboradorEmpresa.value.modo == 'novo'){

                // Valida a senha
                const validacao = senhaStore.validarSenha(modalDadosColaboradorEmpresa.value.data.senha)
            
                // Testa se a senha está nos padrões exigidos
                if (!validacao.valida) {

                    const mensagem = validacao.erros.map(item => `• ${item}`).join('\n')
                    erroStore.exibirErro(mensagem)
                    return
                }
            }
            
            // Salva o valor original do campo valorHora
            var valorOriginal = modalDadosColaboradorEmpresa.value.data.valorHora
            
            if (valorOriginal == '' || valorOriginal == null || valorOriginal == 0){
                valorOriginal = 'R$ 0,00'
            }

            // Remove "R$", pontos e substitui vírgula por ponto
            const valorConvertido = parseFloat(
                valorOriginal.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
            );

            // Salva valor da hora sem R$ e virgulas
            modalDadosColaboradorEmpresa.value.data.valorHora = valorConvertido
            
            // Chama api para salvar colaborador
            const {data: resposta } = await axios.post(`${API_BASE_URL}/administracao/salvaColaborador`, modalDadosColaboradorEmpresa.value.data)

            // Salva id do colaborador
            modalDadosColaboradorEmpresa.value.data.id = resposta.idColaborador
            
            // Restaura o valor da hora orignalmente digitado
            modalDadosColaboradorEmpresa.value.data.valorHora = valorOriginal

            // Recarrega a lista de colaboradores
            carregarListaColaboradoresEmpresa()

            // Exibe mensagem de sucesso
            snackbar.trigger('Colaborador Salvo Com Sucesso.', 'success');

            // Identifica qual o botão que foi pressionado para salvar e executa a função
            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                fecharModalColaborador()
            } else {
                novoColaborador()
            }
            
        } catch(erro){

            // Restaura o valor da hora orignalmente digitado
            modalDadosColaboradorEmpresa.value.data.valorHora = valorOriginal

            erroStore.exibirErro(erro)
        }        
    }
    
    // Regra personalizada para validar campos do for
    async function validarSalvarProdutoEmpresa(funcaoRetorno) {
        
        // Valida o formulário de colaborador
        const isValid = await formCadastroProdutoEmpresa.value?.validate()

        // Se o formulário for válido chama a função para salvar os dados
        if (isValid.valid) {

            // Chama a função para salvar os dados do colaborador
            salvarDadosProdutoEmpresa(funcaoRetorno)

        } else {
            
            // Exibe mensagem de sucesso
            snackbar.trigger('Preencha os campos obrigatórios.', 'error');            
        }
    }

    // Esta função salva os dados do produto da empresa selecionada
    async function salvarDadosProdutoEmpresa(funcaoRetorno) {

        try{
        
            const idProdutoEmpresa = modalDadosProdutoEmpresa.value.data.id

            // Salva o valor original do campo preço licença e preço total
            var valorOriginalPrecoTabela = modalDadosProdutoEmpresa.value.data.precoTabela
            var valorOriginalPrecoTotal = modalDadosProdutoEmpresa.value.data.precoTotal

            if (valorOriginalPrecoTabela == '' || valorOriginalPrecoTabela == null || valorOriginalPrecoTabela == 0){
                valorOriginalPrecoTabela = 'R$ 0,00'
            }
            
            if (valorOriginalPrecoTotal == '' || valorOriginalPrecoTotal == null || valorOriginalPrecoTotal == 0){
                valorOriginalPrecoTotal = 'R$ 0,00'
            }

            // Remove "R$", pontos e substitui vírgula por ponto
            const valorPrecoTabelaConvertido = parseFloat(
                valorOriginalPrecoTabela.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
            );
            
            // Remove "R$", pontos e substitui vírgula por ponto
            const valorPrecoTotalConvertido = parseFloat(
                valorOriginalPrecoTotal.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
            );

            // Salva valor convertido do preço tabela
            modalDadosProdutoEmpresa.value.data.precoTabela = valorPrecoTabelaConvertido

            // Salva valor convertido do preço total
            modalDadosProdutoEmpresa.value.data.precoTotal = valorPrecoTotalConvertido
            
            // Chama api para salvar colaborador
            const { data } = await axios.post(`${API_BASE_URL}/administracao/salvaProdutoEmpresa/${idProdutoEmpresa}`, modalDadosProdutoEmpresa.value.data)

            // Restaura valor do preço tabela
            modalDadosProdutoEmpresa.value.data.precoTabela = valorOriginalPrecoTabela

            // Restaura valor do preço total
            modalDadosProdutoEmpresa.value.data.precoTotal = valorOriginalPrecoTotal

            // Recarrega a lista de colaboradores
            carregarListaProdutosEmpresa()

            // Exibe mensagem de sucesso
            snackbar.trigger('Produto Salvo Com Sucesso.', 'success');

            // Identifica qual o botão que foi pressionado para salvar e executa a função
            if (funcaoRetorno == 'salvar'){
                return
            } else if (funcaoRetorno == 'salvar-retornar'){
                fecharModalProdutoEmpresa()
            } else {
                novoProdutoEmpresa()
            }
            
        } catch(erro){

            // Restaura valor do preço tabela
            modalDadosProdutoEmpresa.value.data.precoTabela = valorOriginalPrecoTabela

            // Restaura valor do preço total
            modalDadosProdutoEmpresa.value.data.precoTotal = valorOriginalPrecoTotal

            // Mostra erro
            erroStore.exibirErro(erro)
        }        
    }    
    
</script>

<style>
    .cursor-pointer {
        cursor: pointer;
    }
    .cursor-pointer:hover {
        opacity: 0.8;
    }
</style>