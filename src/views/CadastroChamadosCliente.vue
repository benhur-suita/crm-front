<template>
  
    <v-app>
        
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
                    'top': toolbarHeight + 'px', // Altura da barra azul
                    'left': '260px', // Largura do menu lateral
                    'width': 'calc(100% - 260px)', // 100% menos o menu lateral
                    'z-index': '999',
                    'transition': 'left 0.3s ease, width 0.3s ease'
                }"
            >        
                <!-- Botão de novo chamado -->
                <v-select
                    v-model="statusSelecionados"
                    :items="opcoesStatus"
                    item-title="title"
                    item-value="value"
                    multiple
                    chips
                    closable-chips
                    clearable
                    bg-color="black"
                    style="margin-top: 25px; width: 100%;"
                    @update:modelValue="carregaListaChamados"
                >
                    <!-- CORREÇÃO: slot chip no Vuetify 3 -->
                    <template v-slot:chip="{ item }">
                    
                        <v-chip
                            :color="getChipColor(item.value)"
                            class="ma-1"
                            closable
                            @click:close="removerStatus(item.value)"
                        >
                            {{ buscaTitulo(item.value) }}
                            <span class="ml-1 count-badge">
                                {{ buscaContagem(item.value) }}
                            </span>
                        </v-chip>
                    
                    </template>

                </v-select>
                
                <v-spacer />
            
                <v-col cols="auto">
                    <v-tooltip text="Novo Chamado" location="top">
                        <template #activator="{ props }">
                        <v-btn
                            icon
                            large
                            class="rounded-button"
                            style="background-color: #4CAF50;"
                            v-bind="props"
                            @click="novoChamado"
                        >
                            <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                        </template>
                    </v-tooltip>
                </v-col>

            </v-toolbar>
            
            <v-container fluid class="pa-4">

                <v-card class="pa-4" style="width: 100%;">
                    
                    <!-- Campo de busca -->
                    <v-text-field
                        v-model="textoBusca"
                        label="Pesquisar"
                        placeholder="Digite sua busca..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        clearable
                        @keyup.enter="carregaListaChamados"
                        @click:clear="carregaListaChamados"
                        @update:modelValue="atualizaParamentrosBusca"
                        style="margin-top: 60px;" 
                    />
                    
                    <!-- Tabela de chamados -->
                    <v-data-table-server
                        item-value="idChamado"
                        v-model:options="opcoesTabelaChamados"
                        :headers="headersChamados"
                        :items="listaChamados"
                        :loading="carregandoChamados"
                        @update:options="carregaListaChamados"
                        class="elevation-2 rounded-lg"
                        density="compact"
                        :style="{ 
                            'font-family': 'Arial, sans-serif !important', 
                            'font-size': '11px !important' 
                        }"
                        hide-default-footer
                    >

                        <!-- Slot para renderizar cada linha -->
                        <template #item="{ item }">

                            <tr
                                @click="selecionarLinha(item.idChamado)"
                                :class="{ 'linha-chamado-selecionada': linhaSelecionada.includes(item.idChamado) }"
                                style="cursor: pointer;"
                            >
                                <!-- Ações agrupadas em menu -->
                                <td>
                                    <v-menu v-model="item.escondeMenu">

                                        <template #activator="{ props }">
                                            <v-btn icon v-bind="props" size="small">
                                                <v-icon>mdi-dots-vertical</v-icon>
                                            </v-btn>
                                        </template>

                                        <v-list>
                                            
                                            <v-list-item @click.stop="editaDadosChamado(item)">
                                                <v-icon start color="orange-darken-2">mdi-pencil</v-icon>
                                                Visualizar Chamado
                                            </v-list-item>
                                            
                                            <v-list-item 
                                                @click.stop="trataOrcamento(item, 'ORCAMENTO APROVADO')" 
                                                v-if="item.Status?.toUpperCase() === 'ORCAMENTO'"
                                            > 
                                                <v-icon start color="green">mdi-cash-multiple</v-icon>
                                                Aprovar Orçamento
                                            </v-list-item>
                                            
                                            <v-list-item 
                                                @click.stop="trataOrcamento('ORCAMENTO REJEITADO')" 
                                                v-if="item.Status?.toUpperCase() === 'ORCAMENTO'">
                                                <v-icon start color="red">mdi mdi-close-circle</v-icon>
                                                Rejetiar Orçamento
                                            </v-list-item>

                                        </v-list>

                                    </v-menu>
                                    
                                </td>

                                <!-- Dados principais -->
                                <td>
                                    <a href="#" @click.prevent="editaDadosChamado(item, 0)">
                                        {{ item.idChamado }}
                                    </a>
                                </td>

                                <td>
                                    <v-chip 
                                        :color="statusColor(item.Status)" 
                                        size="small"
                                        :class="{ 'blink-color-status': item.existeComentario !== 0 }"
                                        @dblclick="editaDadosChamado(item, 0)"
                                    >
                                        {{ item.Status }}
                                    </v-chip>
                                </td>

                                <td>{{ item.Cliente }}</td>
                                <td>{{ item.Solicitante }}</td>
                                <td>{{ item.Prioridade }}</td>
                                <td>{{ item.Abertura }}</td>
                                <td>{{ item.Pendente }}</td>
                                <td>{{ item.Concluído }}</td>
                                <td>{{ item.Tipo }}</td>
                                <td>{{ item.Tag }}</td>
                            </tr>

                            <!-- Linha expandida com comentários -->
                            <transition name="expand">

                                <tr v-if="linhaComentarios(item.idChamado)">
                                    
                                    <td colspan="12" class="pa-0" style="background-color: #f5f5f5;">

                                        <div style="position: relative;">
                                            <v-btn
                                                icon
                                                color="blue"
                                                style="position: absolute; top: 8px; right: 8px; z-index: 10;"
                                                @click.stop="listaComentariosChamado(item, false)"
                                            >
                                            <v-icon>mdi-minus</v-icon>
                                            </v-btn>
                                        </div>

                                        <v-table dense class="comentarios-table" style="table-layout: fixed; width: 100%;">

                                            <colgroup>
                                                <col style="width: 50px;" />
                                                <col style="width: 170px;" />
                                                <col style="width: 170px;" />
                                                <col style="width: 170px;" />
                                                <col style="width: 200px;" />
                                                <col style="width: auto;" />
                                            </colgroup>

                                            <thead>
                                                <tr>
                                                    <th>Editar</th>
                                                    <th>Código</th>
                                                    <th>Comentou</th>
                                                    <th>Lido Por</th>
                                                    <th>Data</th>
                                                    <th>Comentário</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                <tr
                                                    v-for="registroComentarios in item.Comentarios"
                                                    :key="registroComentarios.id"
                                                    @click="linhaComentarioSelecionada = registroComentarios.id"
                                                    :class="{ 'linha-comentario-selecionada': linhaComentarioSelecionada === registroComentarios.id }"
                                                >
                                                    <td>
                                                        <v-tooltip 
                                                            text="Editar Comentário" 
                                                            location="bottom"
                                                            >
                                                            <template #activator="{ props }">
                                                                <v-icon
                                                                    v-bind="props"
                                                                    color="black"
                                                                    size="20"
                                                                    @click.stop="criarEditarComentario(item, registroComentarios.id, 'listaComentarios')"
                                                                    style="cursor: pointer;"
                                                                >
                                                                    mdi-pencil
                                                                </v-icon>
                                                            </template>
                                                        </v-tooltip>
                                                    </td>

                                                    <td style="text-align:center;">{{ registroComentarios.id }}</td>
                                                    <td style="text-align:center;">{{ registroComentarios.nomeQuemComentou }}</td>
                                                    <td style="text-align:center;">{{ registroComentarios.nomeQuemLeu }}</td>
                                                    <td style="text-align:center;">{{ proxy.$formataDataBrasil(registroComentarios.dataComentario) }}</td>
                                                    <td style="text-align:center;" v-html="registroComentarios.comentario"></td>

                                                </tr>

                                                <tr v-if="!item.Comentarios || item.Comentarios.length === 0">
                                                    <td colspan="5" class="text-center text-grey">
                                                        Não existe nenhum comentário para este chamado.
                                                    </td>
                                                </tr>

                                            </tbody>

                                        </v-table>

                                    </td>

                                </tr>

                            </transition>

                        </template>

                    </v-data-table-server>

                </v-card>

            </v-container>
    
            <!-- Modal para exibir os dados do chamado -->
            <v-dialog v-model="modalDadosChamado.visible" max-width="80%" persistent>

                <!-- Card que contém os dados do chamado e só é mostrado quando existem dados na variável modalDadosChamado -->
                <v-card v-if="modalDadosChamado.data">
                    
                    <!-- Mostra o título do modal e o código do chamado -->
                    <v-card-title>Dados Chamado: ({{ modalDadosChamado.data.idChamado }})</v-card-title>

                    <v-card-text>

                        <!-- Formulário para editar os dados do chamado -->
                        <v-form>

                            <v-row dense>

                                <v-col cols="12" sm="6">

                                    <!-- Campo que mostra nome do cliente ligado aos dados pela propriedade v-model -->
                                    <v-text-field 
                                        v-model="modalDadosChamado.data.Cliente" 
                                        label="Cliente"
                                        outlined
                                        :items="clientes"
                                        :disabled="true"
                                        @input="autoCompletaNomeCliente"
                                        ref="focoCampoCliente"
                                    >
                                    </v-text-field>
                                    
                                </v-col>

                                <v-col cols="12" sm="6">

                                    <!-- Select que mostra a lista de contatos do cliente. Seleciona o contato apontando por idColaborador  -->
                                    <v-select
                                        v-model="modalDadosChamado.data.idAbriuChamado"
                                        :items="modalDadosChamado.data.nomeColaboradorCliente"
                                        label="Solicitante"
                                        item-title="title"
                                        item-value="value"
                                        clearable
                                        :disabled="desabilitaCampos"
                                    ></v-select>
                                    
                                </v-col>

                            </v-row>   

                            <v-row dense>

                                <v-col cols="12" sm="4">

                                    <!-- Select que mostra a lista de produtos. Seleciona o produto apontado por idProduto -->
                                    <v-select
                                        v-model="modalDadosChamado.data.idProduto"
                                        :items="modalDadosChamado.data.produtos"
                                        label="Produto"
                                        item-title="title"
                                        item-value="value"
                                        clearable
                                        :disabled="desabilitaCampos"
                                    ></v-select>
                                
                                </v-col>

                                <v-col cols="12" sm="4">

                                    <!-- Select que mostra a lista de tipos de chamados. Seleciona o tipo apontado por idTipoChamado -->
                                    <v-select
                                        v-model="modalDadosChamado.data.idTipoChamado"
                                        :items="modalDadosChamado.data.tipoChamados"
                                        label="Tipo Chamado"
                                        item-title="title"
                                        item-value="value"
                                        clearable
                                        :disabled="desabilitaCampos"
                                    ></v-select>
                                        
                                </v-col>
                            
                                <v-col cols="12" sm="4">

                                    <!-- Select que mostra a lista de status. Seleciona o status apontado por status -->
                                    <v-select
                                        v-model="modalDadosChamado.data.status"
                                        :items="dadosStatus"
                                        label="Status"
                                        item-title="text"
                                        item-value="value"
                                        :disabled="true"
                                    ></v-select>
                                                        
                                </v-col>

                            </v-row>

                            <v-row dense>

                                <v-col cols="12" md="12">
                                
                                    <!-- Campo que mostra o que foi solicitado -->
                                    <v-textarea
                                        v-model="modalDadosChamado.data.solicitado"
                                        label="Solicitação"
                                        placeholder="Descreva em detalhes sua solicitação..."
                                        auto-grow
                                        rows="2"
                                        clearable
                                        variant="filled"
                                        :disabled="desabilitaCampos"
                                        >
                                    </v-textarea>
                                
                                </v-col>

                            </v-row>

                            <v-row dense v-if="mostrarPendencia">

                                <v-col cols="12" md="12">

                                    <!-- Campo que mostra o que foi pendente -->
                                    <v-textarea
                                        v-model="modalDadosChamado.data.pendencia" 
                                        label="Pendência (Use a aba comentários para responder)"
                                        placeholder="Descreva o tipo de pendência..."
                                        auto-grow
                                        rows="2"
                                        clearable
                                        variant="filled"
                                        :disabled="true"
                                        >
                                    </v-textarea>
                                    
                                </v-col>

                            </v-row>

                            <v-row dense v-if="mostrarExecutado">
                                
                                <v-col cols="12" md="12">

                                    <!-- Campo que mostra o que foi executado -->
                                    <v-textarea
                                        v-model="modalDadosChamado.data.executado"
                                        label="Executado"
                                        placeholder="Descreva o que foi executado..."
                                        auto-grow
                                        rows="2"
                                        clearable
                                        variant="filled"
                                        :disabled="true"
                                        >
                                    </v-textarea>

                                </v-col>

                            </v-row>

                            <v-row dense v-if="mostrarDescricaoOrcamento">

                                <v-col cols="12" md="10">

                                    <!-- Campo para entrar com a descrição do orçamento -->
                                    <v-textarea
                                        v-model="modalDadosChamado.data.descricaoOrcamento" 
                                        label="Descrição Orçamento"
                                        placeholder="Descreva o que será feito..."
                                        auto-grow
                                        rows="2"
                                        clearable
                                        variant="filled"
                                        :disabled="true"
                                        >
                                    </v-textarea>
                                    
                                </v-col>

                                <v-col cols="12" sm="2">

                                    <v-text-field
                                        v-model="modalDadosChamado.data.custoOrcamento"
                                        label="Custo Orçamento"
                                        placeholder="0,00"
                                        type="text"
                                        variant="filled"
                                        disabled="true"
                                        @input="formatarCusto($event, 'orcamento')"
                                    />

                                </v-col>
                                
                            </v-row>
                            
                            <v-row dense>

                                <v-col cols="12" md="2">

                                    <v-text-field
                                        :model-value="modalDadosChamado.data.dataAbertura"
                                        label="Abertura"
                                        prepend-icon="mdi-calendar"
                                        :disabled="true"                                    
                                    ></v-text-field>
                                
                                </v-col>
                                
                                <v-col cols="12" md="2">

                                    <v-text-field
                                        :model-value="modalDadosChamado.data.dataExecucao"
                                        label="Execução"
                                        prepend-icon="mdi-calendar"
                                        :disabled="true"
                                    ></v-text-field>
                                
                                </v-col>    
                                
                                <v-col cols="12" md="2">

                                    <v-text-field
                                        :model-value="modalDadosChamado.data.dataConclusao"
                                        label="Concluído"
                                        prepend-icon="mdi-calendar"
                                        :disabled="true"                                   
                                    ></v-text-field>
                                
                                </v-col>

                                <v-col cols="12" md="2">

                                    <v-text-field
                                        :model-value="modalDadosChamado.data.dataPendencia"
                                        label="Pendência"
                                        prepend-icon="mdi-calendar"
                                        v-bind="props"
                                        :disabled="true"                                                
                                    ></v-text-field>
                                
                                </v-col>
                                
                                <v-col cols="12" md="2">

                                    <v-text-field
                                        :model-value="modalDadosChamado.data.dataPrevisao"
                                        label="Previsão"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="props"
                                        :disabled="true"
                                    ></v-text-field>

                                </v-col>
                                
                                <v-col cols="12" md="2">
                                    <v-select
                                        v-model="modalDadosChamado.data.prioridade"
                                        :disabled="desabilitaCampos"
                                        :items="dadosPrioridade"
                                        label="Prioridade"
                                        item-title="text"
                                        item-value="value"
                                    ></v-select>
                                </v-col>
                                
                            </v-row>                            

                            <v-row dense>

                                <v-col cols="12">

                                    <v-file-input
                                        v-model="mostraAnexosChamado"
                                        multiple
                                        label="Selecione os arquivos"
                                        prepend-icon="mdi-paperclip"
                                        @change="manipuladorArquivoChamado"
                                        :loading="fazendoUploadChamado"
                                        :disabled="fazendoUploadChamado || desabilitaCampos"
                                        class="ma-4"
                                        :clearable="false"
                                    >
                                        <template v-slot:selection="{ file }">

                                            <v-chip                                            
                                                v-for="(fileObj, index) in arquivosAnexadosChamado"
                                                :key="fileObj.uniqueId || index"
                                                close
                                                class="ma-1"
                                                :color="fileObj.isExisting ? 'primary' : 'default'"
                                            >
                                                {{ fileObj.displayName }}

                                                <!-- Ícone para remover o arquivo -->
                                                <v-icon
                                                    class="ml-2"
                                                    color="red"
                                                    size="18"
                                                    @click.stop="removeAnexoChamado(index)"
                                                    style="cursor: pointer;"
                                                >
                                                    mdi-close-circle
                                                </v-icon>

                                                <!-- Ícone para download, se o arquivo já existir -->
                                                <v-icon 
                                                    v-if="fileObj.isExisting" 
                                                    class="ml-1"
                                                    color="blue"
                                                    size="18"
                                                    @click.stop="downloadArquivoChamado(fileObj)"
                                                    style="cursor: pointer;"
                                                >
                                                    mdi-download
                                                </v-icon>

                                            </v-chip>
                                            
                                        </template>

                                    </v-file-input>

                                    <v-progress-linear
                                        v-if="fazendoUploadChamado"
                                        v-model="uploadProgressChamado"
                                        color="light-blue"
                                        height="10"
                                        class="ma-4"
                                    >
                                    </v-progress-linear>

                                    <v-alert
                                        v-if="uploadMessageChamado"
                                        :type="isError ? 'error' : 'success'"
                                        class="ma-4"
                                    >
                                        {{ uploadMessageChamado }}
                                    </v-alert>

                                </v-col>

                            </v-row>

                        </v-form>

                        <!-- Acordeon com lista de colaboradores da empresa -->
                        <v-expansion-panels 
                            v-model="acordeonComentarios" 
                            v-show="mostraAcordeonComantarios == true" 
                            id="acordeonComentarios" 
                            class="mt-4  mb-4">

                            <v-expansion-panel>

                                <v-expansion-panel-title>
                                    Clique Aqui Para Ler/Fazer Comentários Sobre o Chamado
                                </v-expansion-panel-title>

                                <v-expansion-panel-text>

                                    <v-row class="mb-4" align="center" justify="end">

                                        <!-- Botão para criar novo colaborador -->
                                        <v-col cols="auto">
                                            <v-tooltip text="Adicionar comentário" location="top">
                                                <template #activator="{ props }">
                                                <v-btn
                                                    icon
                                                    large
                                                    class="rounded-button"
                                                    style="background-color: #4CAF50;"
                                                    v-bind="props"
                                                    @click="criarEditarComentario(item, 0, 'modalChamados')"
                                                >
                                                    <v-icon color="white">mdi-plus</v-icon>
                                                </v-btn>
                                                </template>
                                            </v-tooltip>
                                        </v-col>

                                    </v-row>

                                    <v-data-table-server
                                        v-model:options="opcoesTabelaComentarios"
                                        :headers="headersComentariosAcordeon"
                                        :items="listaComentariosAcordeon"
                                        :loading="carregandoComentariosAcordeon"
                                        :items-length="totalComentariosAcordeon"
                                        @update:options="carregarListaComentariosAcordeon"
                                    >
                                        <template v-slot:item.funcoes="{ item }">
                        
                                            <!-- Ícone de atalho para editar chamado -->
                                            <v-tooltip text="Editar Comentário" location="bottom">

                                                <template #activator="{ props }">
                                                    
                                                    <v-icon
                                                        v-bind="props"
                                                        :color="item.comentarioLido === 1 ? 'green' : 'red'" 
                                                        size="24" 
                                                        @click="criarEditarComentario(item, item.id, 'modalChamados')"
                                                        style="cursor: pointer; margin-right: 8px;"
                                                    >
                                                    mdi-pencil
                                                    </v-icon>

                                                </template>

                                            </v-tooltip>
                                            
                                        </template>
                                        
                                        <template #item.ativo="{ item }">
                                            <span :class="item.ativo === 1 ? 'text-green' : 'text-red'">
                                            {{ item.ativo === 1 ? 'Ativo' : 'Inativo' }}
                                            </span>
                                        </template>

                                        <!-- Sobrescreve a coluna Lido para formatar -->
                                        <template #[`item.comentarioLido`]="{ item }">
                                            <v-chip 
                                                :color="item.comentarioLido ? 'success' : 'error'" 
                                                size="small"
                                            >
                                                {{ item.comentarioLido ? 'Sim' : 'Não' }}
                                            </v-chip>
                                        </template>
                                        
                                    </v-data-table-server>

                                </v-expansion-panel-text>

                            </v-expansion-panel>

                        </v-expansion-panels>
                    
                    </v-card-text>

                    <v-card-actions>
                        <v-btn 
                            color="success" 
                            class="mt-4" 
                            @click="salvaChamado"
                            v-if="mostrarBotaoSalvarChamado"
                            >
                                Salvar
                            </v-btn>
                        <v-btn color="red" class="mt-4" @click="fecharModalChamados">Fechar</v-btn>
                    </v-card-actions>

                </v-card>

            </v-dialog>

            <!-- Modal para exibir comentarios -->
            <v-dialog v-model="modalDadosComentario.visible" max-width="50%" persistent>

                <!-- Card que contém os dados do chamado e só é mostrado quando existem dados na variável modalDadosChamado -->
                <v-card v-if="modalDadosComentario.data">
                    
                    <!-- Mostra o título do modal e o código do chamado -->
                    <v-card-title style="font-size: 17px;">
                        Comentário Chamado: {{ '(' + modalDadosComentario.data.idChamado + ')  Feito Em: ' + modalDadosComentario.data.dataComentario }}
                    </v-card-title>

                    <!-- Formulário para editar os dados do chamado -->                        
                    <v-card-text>

                        <!-- Campo que mostra o que foi solicitado -->
                        <v-textarea
                            v-model="modalDadosComentario.data.textoComentario"
                            placeholder="Descreva Seu Comentário..."
                            auto-grow
                            rows="12"
                            clearable
                            variant="filled"
                            style="width: 100% !important; max-width: none !important; height: 100% !important;"
                            >
                        </v-textarea>
                    
                    </v-card-text>
                    
                     <v-row dense>

                        <!-- File input para upload de arquivos de comentários -->
                        <v-col cols="12">

                            <v-file-input
                                v-model="mostraAnexosComentario"
                                multiple
                                label="Selecione os arquivos"
                                prepend-icon="mdi-paperclip"
                                @change="manipuladorArquivoComentario"
                                :loading="fazendoUploadComentario"
                                :disabled="fazendoUploadComentario || mostrarBotaoSalvarComentario"
                                class="ma-4"
                                :clearable="false"
                            >
                                <template v-slot:selection="{ file }">

                                    <v-chip
                                    
                                        v-for="(fileObj, index) in arquivosAnexadosComentario"
                                        :key="fileObj.uniqueId || index"
                                        close
                                        class="ma-1"
                                        :color="fileObj.isExisting ? 'primary' : 'default'"
                                    >
                                        {{ fileObj.displayName }}

                                        <!-- Ícone para remover o arquivo -->
                                        <v-icon
                                            class="ml-2"
                                            color="red"
                                            size="18"
                                            @click.stop="removeAnexoComentario(index)"
                                            style="cursor: pointer;"
                                        >
                                            mdi-close-circle
                                        </v-icon>

                                        <!-- Ícone para download, se o arquivo já existir -->
                                        <v-icon 
                                            v-if="fileObj.isExisting" 
                                            class="ml-1"
                                            color="blue"
                                            size="18"
                                            @click.stop="downloadArquivoComentario(fileObj)"
                                            style="cursor: pointer;"
                                        >
                                            mdi-download
                                        </v-icon>

                                    </v-chip>
                                    
                                </template>

                            </v-file-input>

                            <v-progress-linear
                                v-if="fazendoUploadComentario"
                                v-model="uploadProgressComentario"
                                color="light-blue"
                                height="10"
                                class="ma-4"
                            >
                            </v-progress-linear>

                            <v-alert
                                v-if="uploadMessageComentario"
                                :type="isError ? 'error' : 'success'"
                                class="ma-4"
                            >
                                {{ uploadMessageComentario }}
                            </v-alert>

                        </v-col>

                    </v-row>

                    <v-card-actions>
                        
                        <v-btn
                            color="success" 
                            class="mt-4" 
                            @click="salvaComentario"
                            v-if="mostrarBotaoSalvarComentario"
                        >Salvar</v-btn>
                        
                        <v-btn color="red" class="mt-4" @click="fecharModalComentario">Fechar</v-btn>
                    </v-card-actions>

                </v-card>

            </v-dialog>

        </v-main>
  
    </v-app>

</template>

<script setup>

    // Importa dependências
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

    // Importa useRoute para acessar parâmetros de rota
    import { useRouter } from 'vue-router'

    // Importa módulo que controla as autorizacoes se está logado ou não
    import { useAuthStore } from '@/stores/authStore'

    // Importa a store de erros
    const erroStore = useErroStore()

    // Permite acessar rotinas globais
    const { proxy } = getCurrentInstance()

    // Importa a store de chamados
    const loginStore = useLoginStore()

    // Acessa o ID da empresa via query param
    const router = useRouter();

    // Cria variável que receberão os dados das autorizações de login
    const autorizacaoLogin = useAuthStore()

    // Variável que indica se o formulário modal de chamados está aberto
    var modalChamadoAberto = false;

    // Variável que salva o custo final de um chamado
    var custoCalculoChamado = 0;
    
    // Define variável usada para salvar o código do chamado quando este for salvo ou editado
    const mostraAcordeonComantarios = ref(false);

    // Define variável reativa para mostrar/esconder botão salvar chamado
    const mostrarBotaoSalvarChamado = ref(false)

    // Define variável reativa para mostrar ou esconder o orçamento
    const mostrarAtallhoOrcamento = ref (false)

    // Define variável reativa para mostrar/esconder botão salvar comentário
    const mostrarBotaoSalvarComentario = ref(false)

    
    // Importa a store do snackbar
    const snackbar = useSnackbarStore()
    
    // Busca dados do login do usuário
    const idEmpresaLogada = loginStore.idEmpresa
    const nomeEmpresaLogada = loginStore.nomeFantasia
    const idColaborador = loginStore.idColaborador
    const departamentoColaborador = loginStore.departamentoColaborador
    const nomeColaborador = loginStore.nomeColaborador
    const emailColaborador = loginStore.emailColaborador
    const empresaManutencao = loginStore.empresaManutencao
    
    // Define o elemento v-text-field da pesquisa
    const textoBusca = ref('')
    
    // Define elemento da lista de chamados
    const listaChamados = ref([])
    
    // Define elemento que mostra a barra de progresso da carga da tabela
    const carregandoChamados = ref(false)

    // Define elemento que mostra a barra de progresso da carga dos comentários
    const carregandoComentariosAcordeon = ref(false)
    
    // Define as variáveis de paginação da tabela do acordeon de comentários do chamado
    const listaComentariosAcordeon = ref([])
    const totalComentariosAcordeon = ref(0)
    const acordeonComentarios = ref([])

    // Define array contendo o campo que deve ser ordenado inicialmente e a direção
    const opcoesTabelaChamados = ref({ 
        page: 1,
        itemsPerPage: 10,
        sortBy: ['status'],
        sortDesc: [false]
    })
    
    // Cria opções iniciais da tabela de comentários de chamados do modal
    const opcoesTabelaComentarios = ref({
        page: 1,
        itemsPerPage: 10,
        sortBy: ['id'],
        sortDesc: [true]
    });

    // Array de objetos com valor string
    const opcoesStatus = ref([
        { title: 'Aberto', value: 'ABERTO' },
        { title: 'Execução', value: 'EXECUCAO' },
        { title: 'Pendente', value: 'PENDENTE' },
        { title: 'Pendente Cliente', value: 'PENDENTE CLIENTE' },
        { title: 'Orçamentos', value: 'ORCAMENTO' },
        { title: 'Orçamentos Aprovados', value: 'ORCAMENTO APROVADO' },
        { title: 'Orçamentos Rejeitados', value: 'ORCAMENTO REJEITADO' },
        { title: 'Concluído', value: 'CONCLUIDO' }        
    ])

    // Objeto para armazenar contagens
    const contagemStatus = ref({})

    // Seleciona o status default
    const statusSelecionados = ref(['ABERTO', 'EXECUCAO', 'PENDENTE', 'PENDENTE CLIENTE', 'ORCAMENTO','ORCAMENTO APROVADO'])

    // Define variável com a linha selecionada
    const linhaSelecionada = ref([])
    const linhaComentarioSelecionada = ref(null)
    
    // Define variável informando que os comentários estão sendo mostrados
    const chamadosExpandidos = ref([])
    
    // Define os cabeçalhos da tabela de chamados
    const headersChamados = [
        { title: 'Funções', text: 'Funções', value: 'Funções', width: '1px', sortable: false },
        { title: 'Código', text: 'Código', value: 'idChamado', width: '1px', sortable: true },
        { title: 'Status', text: 'Status', value: 'Status', width: '340px', sortable: true },
        { title: 'Cliente', text: 'Cliente', value: 'Cliente', width: '380px', sortable: true },
        { title: 'Solicitante', text: 'Solicitante', value: 'Solicitante', width: '380px', sortable: true },
        { title: 'Prioridade', text: 'Prioridade', value: 'Prioridade', width: '10px', sortable: true },
        { title: 'Abertura', text: 'Abertura', value: 'Abertura', width: '280px', sortable: true },
        { title: 'Pendente', text: 'Pendente', value: 'Pendente', width: '280px', sortable: true },
        { title: 'Concluído', text: 'Concluído', value: 'Concluído', width: '280px', sortable: true },
        { title: 'Tipo', text: 'Tipo', value: 'Tipo', width: '280px', sortable: true },
        { title: 'Tag', text: 'Tag', value: 'Tag', width: '150px', sortable: true }
    ]

    // Define os cabeçalhos da tabela de comentários no acordeon
    const headersComentariosAcordeon = [
        { title: 'Funções', text: 'Funções', value: 'funcoes', width: '1px', sortable: false },
        { title: 'Código', text: 'Código', value: 'id', width: '1px', sortable: true },
        { title: 'Comentou', text: 'Comentou', value: 'nomeQuemComentou', width: '200px', sortable: true },
        { title: 'Lido Por', text: 'Lido Por', value: 'nomeQuemLeu', width: '200px', sortable: true },
        { title: 'Data Comentário', text: 'Data Comentário', value: 'dataComentario', width: '200px', sortable: true },
        { title: 'Comentário', text: 'Comentário', value: 'textoComentario', width: '400px', sortable: true },
        { title: 'Lido', text: 'Lido', value: 'comentarioLido', width: '100px', sortable: true }
    ]

    // Variável reativa que desabilita o campo cliente quando um novo chamado for criado
    const desabilitaCampoCliente = ref(false)
    
    // Desabilita campo cliente caso o chamado já exista
    const desabilitaCampos = ref(false)
    
    // Desabilta o botão savar do modal de comentários
    const desabilitarSalvarModalComentarios = ref (false)
    
    // Define o array clientes do modal de chamados
    const clientes = ref([])
    
    // Define o array com as sugestões do autocompleta
    const sugestoes = ref([])
    
    // Definindo os estados dos menus como reativos
    const vmodelCalendarioAberto = ref(false)
    const vmodelCalendarioPrevisao = ref(false)
    const vmodelCalendarioExecucao = ref(false)
    const vmodelCalendarioConclusao = ref(false)
    const vmodelCalendarioPendencia = ref(false)
    const mostrarRelogio = ref(false)

    // Variáveis da rotina de upload
    const uploadProgressChamado = ref(0);
    const uploadProgressComentario = ref(0);
    const uploadMessageChamado = ref('');
    const uploadMessageComentario = ref('');
    const isError = ref(false);
    
    // Define a variável do campo descrição do orçamento
    const mostrarPendencia = ref(false)
    const mostrarExecutado = ref(false)
    const mostrarDescricaoOrcamento = ref(false);

    // Declara que o componente pode emitir eventos, especificamente o evento update:modelValue.
    const emit = defineEmits(['submit']);
    
    // Variáveis usadas no upload de arquivos
    const mostraAnexosChamado = ref([]); // Arquivos mostrados no input do chamado
    const mostraAnexosComentario = ref([]); // Arquivos mostrados no input  do comentário
    const arquivosAnexadosChamado = ref([]); // Todos os arquivos (novos + existentes)
    const arquivosAnexadosComentario = ref([]); // Todos os arquivos (novos + existentes)
    const fazendoUploadChamado = ref(false);
    const fazendoUploadComentario = ref(false);
    
    /* ROTINAS CONSTANTES DA PÁGINA DE CHAMADOS*/

    // Constante referente aos dados do chamado
    const modalDadosChamado = ref({
        visible: false,
        data: {
            idChamado: 0,
            Cliente: '',
            idEmpresa: '',
            idAbriuChamado: [],
            nomeColaboradorCliente: '',
            idProduto: [],
            produtos: '',
            idTipoChamado: [],
            tipoChamados: '',
            status: 'ABERTO',
            prioridade: 'BAIXA',
            solicitado: '',
            executado: '',
            pendencia: '',
            dataAbertura: '',
            dataExecucao: '',
            dataConclusao: '',
            dataPendencia: '',
            dataPrevisao: '',
            dataOrcamento: '',
            ordemExibicao: 0,
            descricaoOrcamento: '',
            custoOrcamento: 0,
            orcamentoLiberado: 0,
            arquivosAnexosChamado: []
        }
    });
    
    const focoCampoCliente = ref(null)

    // Variável reativa para o modal de comentários
    const modalDadosComentario = ref({
        visible: false,
        data: {
            id: 0,
            idChamado: 0,
            idComentou: 0,
            idQuemLeu: 0,
            textoComentario: '',
            dataComentario: '',
            nomeQuemComentou: '',
            nomeQuemLeu: '',
            comentarioLido: false,
            arquivosAnexosComentario: []
        }
    });

    // Variáveis com dados de status do chamado e prioridade
    const dadosStatus = [
        { value: 'ABERTO', text: 'ABERTO' },
        { value: 'EXECUCAO', text: 'EXECUÇÃO' },
        { value: 'PENDENTE', text: 'PENDENTE' },
        { value: 'PENDENTE CLIENTE', text: 'PENDENTE CLIENTE' },
        { value: 'CONCLUIDO', text: 'CONCLUIDO' },
        { value: 'ORCAMENTO', text: 'ORÇAMENTO' },
        { value: 'ORCAMENTO APROVADO', text: 'ORÇAMENTO APROVADO' },
        { value: 'ORCAMENTO REJEITADO', text: 'ORÇAMENTO REJEITADO' }
    ]

    // Variável com dados de prioridade do chamado
    const dadosPrioridade = [
        { value: 'BAIXA', text: 'BAIXA' },
        { value: 'MÉDIA', text: 'MÉDIA' },
        { value: 'ALTA', text: 'ALTA' }
    ]

    // Formata o tamanho do arquivo
    const formatFileSize = (bytes) => {
        if (!bytes || isNaN(bytes)) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Define o emit para o upload de arquivos
    const props = defineProps({
        modelValue: {
            type: Array,
            default: () => []
        },
        chamadoId: {
            type: [Number, String],
            required: false
        }
    });

    // Função para atualizar o v-model com os arquivos atuais do chamado
    const manipuladorArquivoChamado = (event) => {

        // Verifica se o evento contém arquivos, sai da função se não houver
        const arquivoEntrada = event.target.files;

        if (!arquivoEntrada || arquivoEntrada.length === 0) return;

        // Converte lista de arquivos para array e filtra arquivos já selecionados
        const novoArquivo = Array.from(arquivoEntrada).filter(arquivo => {

                // Verifica se o arquivo NÃO está já na lista arquivosAnexadosChamado
                return !arquivosAnexadosChamado.value.some(
                    existingFile => 
                        existingFile.name === arquivo.name && 
                        existingFile.size === arquivo.size
                );
            
        }).map(arquivo => ({
                
            name: arquivo.name,
            size: arquivo.size,
            type: arquivo.type || 'application/octet-stream',
            lastModified: arquivo.lastModified || Date.now(),
            raw: arquivo,       // Mantém a referência ao File original
            uniqueId: null,     // Será preenchido após upload
            isExisting: false,
            displayName: `${arquivo.name} (${formatFileSize(arquivo.size)})`,
            serverName: null    // Será preenchido após upload

        }));

        // Atualiza a lista de arquivos mostrados
        if (novoArquivo.length > 0) {

            // Salva o novo arquivo na lista de todos os anexos
            arquivosAnexadosChamado.value = [...arquivosAnexadosChamado.value, ...novoArquivo];
            
            // Atualiza o displayFiles para mostrar os novos arquivos
            snackbar.trigger(`${novoArquivo.length} Novo(s) Arquivo(s) Adicionado(s)`, 'success');

        } else {
            
            // Todos os arquivos selecionados já estão na lista
            snackbar.trigger('Arquivo Já Está Na Seleção', 'warning');
        }

        event.target.value = '';
    };

    // Função para atualizar o v-model com os arquivos atuais do comentário
    const manipuladorArquivoComentario = (event) => {

        // Verifica se o evento contém arquivos, sai da função se não houver
        const arquivoEntrada = event.target.files;

        if (!arquivoEntrada || arquivoEntrada.length === 0) return;

        // Converte lista de arquivos para array e filtra arquivos já selecionados
        const novoArquivo = Array.from(arquivoEntrada).filter(arquivo => {

            // Verifica se o arquivo NÃO está já na lista arquivosAnexadosChamado
            return !arquivosAnexadosComentario.value.some(
                existingFile => 
                    existingFile.name === arquivo.name && 
                    existingFile.size === arquivo.size
            );
            
        }).map(arquivo => ({
                
            name: arquivo.name,
            size: arquivo.size,
            type: arquivo.type || 'application/octet-stream',
            lastModified: arquivo.lastModified || Date.now(),
            raw: arquivo,       // Mantém a referência ao File original
            uniqueId: null,     // Será preenchido após upload
            isExisting: false,
            displayName: `${arquivo.name} (${formatFileSize(arquivo.size)})`,
            serverName: null    // Será preenchido após upload

        }));

        // Atualiza a lista de arquivos mostrados
        if (novoArquivo.length > 0) {

            // Salva o novo arquivo na lista de todos os anexos
            arquivosAnexadosComentario.value = [...arquivosAnexadosComentario.value, ...novoArquivo];
            
            // Atualiza o displayFiles para mostrar os novos arquivos
            snackbar.trigger(`${novoArquivo.length} novo(s) arquivo(s) adicionado(s)`);

        } else {
            
            // Todos os arquivos selecionados já estão na lista
            snackbar.trigger('Arquivo Já Está Na Seleção', 'warning');
        }

        event.target.value = '';
    };

    // Esta rotina executa o upload dos arquivos do chamado
    const uploadArquivosChamado = async () => {

        // Filtra apenas arquivos que ainda não foram enviados (sem uniqueId)
        const arquivosParaUpload = arquivosAnexadosChamado.value.filter(arquivo =>
            !arquivo.uniqueId && arquivo.raw
        );

        // Se não houver arquivos para upload, retorna erro
        if (arquivosParaUpload.length === 0) {
            return { status: 'erro' };
        }

        try {

            // Indica que o upload está em andamento
            fazendoUploadChamado.value = true;

            // Cria o FormData para o upload
            const formData = new FormData();
            
            // Adiciona cada arquivo ao FormData
            arquivosParaUpload.forEach(arquivo => {
                formData.append('files', arquivo.raw, arquivo.name);
            });

            // Chama API para upload dos arquivos
            const { data: retornoApi } = await axios.post(`${API_BASE_URL}/api/uploadArquivos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Atualiza os arquivos com os dados retornados da API
            arquivosAnexadosChamado.value = arquivosAnexadosChamado.value.map(arquivo => {

                // Encontra o arquivo correspondente na resposta da API
                const arquivoEnviado = retornoApi.files.find(comparaArquivo =>
                    comparaArquivo.originalName === arquivo.name && comparaArquivo.size === arquivo.size
                );
                
                return arquivoEnviado ? 
                {
                    ...arquivo,
                    serverName: arquivoEnviado.serverName,
                    path: arquivoEnviado.path,
                    uniqueId: arquivoEnviado.uniqueId,
                    isExisting: true,
                    displayName: `${arquivoEnviado.originalName} (${formatFileSize(arquivoEnviado.size)})`
                } : arquivo;
            });            

            return { status: 'sucesso' };
            
        } catch (erro) {

            erroStore.exibirErro(erro)
            return { status: 'erro' };

        } finally {
            fazendoUploadChamado.value = false;
        }
    };

    // Esta rotina executa o upload dos arquivos do chamado
    const uploadArquivosComentario = async () => {

        // Filtra apenas arquivos que ainda não foram enviados (sem uniqueId)
        const arquivosParaUpload = arquivosAnexadosComentario.value.filter(arquivo =>
            !arquivo.uniqueId && arquivo.raw
        );

        // Se não houver arquivos para upload, retorna erro
        if (arquivosParaUpload.length === 0) {
            return { status: '' };
        }

        try {

            // Indica que o upload está em andamento
            fazendoUploadComentario.value = true;

            // Cria o FormData para o upload
            const formData = new FormData();
            
            // Adiciona cada arquivo ao FormData
            arquivosParaUpload.forEach(arquivo => {
                formData.append('files', arquivo.raw, arquivo.name);
            });

            // Chama API para upload dos arquivos
            const { data: retornoApi } = await axios.post(`${API_BASE_URL}/api/uploadArquivos`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Atualiza os arquivos com os dados retornados da API
            arquivosAnexadosComentario.value = arquivosAnexadosComentario.value.map(arquivo => {

                // Encontra o arquivo correspondente na resposta da API
                const arquivoEnviado = retornoApi.files.find(comparaArquivo =>
                    comparaArquivo.originalName === arquivo.name && comparaArquivo.size === arquivo.size
                );
                
                return arquivoEnviado ? 
                {
                    ...arquivo,
                    serverName: arquivoEnviado.serverName,
                    path: arquivoEnviado.path,
                    uniqueId: arquivoEnviado.uniqueId,
                    isExisting: true,
                    displayName: `${arquivoEnviado.originalName} (${formatFileSize(arquivoEnviado.size)})`
                }
                : arquivo;
            });            

            return { status: 'sucesso' };
            
        } catch (erro) {
            erroStore.exibirErro(erro)
        } finally {
            fazendoUploadComentario.value = false;
        }
    };

    // Download de arquivo existente
    const downloadArquivoChamado = async (file) => {

        // Verifica se o arquivo tem um nome de servidor válido
        if (!file.serverName) return;
                    
        // Retira nome do arquivo do caminho
        const nomeArquivo = file.path.split('\\').pop();

        try{

            // Faz a requisição para baixar o arquivo
            fetch(`${API_BASE_URL}/api/download/${nomeArquivo}`).then((res) => {
            
                if (!res.ok) throw new Error('Erro ao baixar');       
                
                return res.blob();
            
            }).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name || nomeArquivo;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            });

        } catch (erro) {            
            erroStore.exibirErro(erro)
        }
    };
    
    // Download de arquivo existente
    const downloadArquivoComentario = async (file) => {

        // Verifica se o arquivo tem um nome de servidor válido
        if (!file.serverName) return;
                    
        // Retira nome do arquivo do caminho
        const nomeArquivo = file.path.split('\\').pop();

        try{

            // Faz a requisição para baixar o arquivo
            fetch(`${API_BASE_URL}/api/download/${nomeArquivo}`).then((res) => {
            
                if (!res.ok) throw new Error('Erro ao baixar');       
                
                return res.blob();
            
            }).then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name || nomeArquivo;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            });

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    };

    // Remove um arquivo anexo do chamado
    const removeAnexoChamado = (index) => {

        // Verifica se o índice é válido
        if (index < 0 || index >= arquivosAnexadosChamado.value.length) return;
        
        // Busca o arquivo a ser removido
        const arquivoParaRemover = arquivosAnexadosChamado.value[index];

        // Chama API para remover o arquivo do servidor
        axios.delete(`${API_BASE_URL}/operacao/excluirArquivoAnexoChamado/${arquivoParaRemover.uniqueId}`).then(() => {
                            
            // Mostra mensagem de sucesso
            snackbar.trigger(`Arquivo ${arquivoParaRemover.displayName} Removido Com Sucesso!`, 'success');

            // Remove o arquivo da lista local
            arquivosAnexadosChamado.value.splice(index, 1);

            // Remove o arquivo da lista do modal chamados
            mostraAnexosChamado.value = [...arquivosAnexadosChamado.value];
            
            // Remove o arquivo da lista do modal
            mostraAnexosChamado.value.data.arquivosAnexosChamado.splice(index, 1);
            
            // Trata erro na remoção do arquivo
            }).catch(erro => {                    
                erroStore.exibirErro(erro)                    
            }
        );        
    };
    
    // Remove um arquivo anexo do comentario
    const removeAnexoComentario = (index) => {

        // Verifica se o índice é válido
        if (index < 0 || index >= arquivosAnexadosComentario.value.length) return;
        
        // Busca o arquivo a ser removido
        const arquivoParaRemover = arquivosAnexadosComentario.value[index];

        // Chama API para remover o arquivo do servidor
        axios.delete(`${API_BASE_URL}/operacao/excluirArquivoAnexoComentario/${arquivoParaRemover.uniqueId}`).then(() => {
                            
            // Mostra mensagem de sucesso
            snackbar.trigger(`Arquivo ${arquivoParaRemover.displayName} Removido Com Sucesso!`, 'success');
            
            // Remove o arquivo da lista local
            arquivosAnexadosComentario.value.splice(index, 1);
            
            // Remove o arquivo da lista do modal
            modalDadosComentario.value.data.arquivosAnexosComentario.splice(index, 1);
            
            // Atualiza a lista de arquivos mostrados
            mostraAnexosComentario.value = [...arquivosAnexadosComentario.value];
            
            // Trata erro na remoção do arquivo
            }).catch(erro => {
                erroStore.exibirErro(erro)                
            }
        );        
    };

    // ✅ Esta rotina trata o botão confirmar dos calendários
    const confirmaDatas = (funcao, dataEntrada, horaEntrada) => {

        if (!dataEntrada) return;

        if (!horaEntrada) {
            horaEntrada = '00:00';
        }   

        // Busca ano, mes e dia da data de abertura
        const ano = dataEntrada.getFullYear();
        const mes = dataEntrada.getMonth();
        const dia = dataEntrada.getDate();
        
        const [hora, minuto] = horaEntrada.split(':');

        const dataFinal = new Date(ano, mes, dia, hora, minuto);

        if (funcao == 1){            
            modalDadosChamado.value.data.dataAbertura = proxy.$formataDataBrasil(dataFinal)
        } else if (funcao == 2) {
            modalDadosChamado.value.data.dataPrevisao = proxy.$formataDataBrasil(dataFinal)
        } else if (funcao == 3) {
            modalDadosChamado.value.data.dataExecucao = proxy.$formataDataBrasil(dataFinal)
        } else if (funcao == 4) {
            modalDadosChamado.value.data.dataConclusao = proxy.$formataDataBrasil(dataFinal)
        } else if (funcao == 5) {
            modalDadosChamado.value.data.dataPendencia = proxy.$formataDataBrasil(dataFinal)
        }

        fecharCalendario();
    };

    // Função para fechar todos os menus do calendário
    const fecharCalendario = () => {
        vmodelCalendarioAberto.value = false;
        vmodelCalendarioPrevisao.value = false;
        vmodelCalendarioExecucao.value = false;
        vmodelCalendarioConclusao.value = false;
        vmodelCalendarioPendencia.value = false;
        mostrarRelogio.value = false;
    };

    // Carrega comentarios do chamado no acordeon do modal de cadastro de chamados
    const carregarListaComentariosAcordeon = async () => {
        
        // Blindagem contra estados intermediários
        const sortArray = Array.isArray(opcoesTabelaComentarios.value?.sortBy) 
            ? opcoesTabelaComentarios.value.sortBy 
            : []
        
        const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

        // // 2) Defaults estáveis (sem jamais acessar [0] de algo indefinido)
        const ordenacaoPor = primeiraOrdenacao?.key ?? 'id'
        const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'desc'
        
        // Extrai paginação
        const paginaAtual = opcoesTabelaComentarios.value.page ?? 1
        const itensPorPagina = opcoesTabelaComentarios.value.itemsPerPage ?? 10
        
        // Busca o idChamado do modalDadosChamado
        const idChamado = modalDadosChamado.value.data.idChamado

        // Limpa a lista de colaboradores
        listaComentariosAcordeon.value = []

        // Reseta o total de colaboradores
        totalComentariosAcordeon.value = 0

        try {

            // Verifica se não está executando a busca da lista de comentários
            if (carregandoComentariosAcordeon.value == false){

                // Liga o indicador de carregamento
                carregandoComentariosAcordeon.value = true
            
                // Chama a API para buscar os colaboradores da empresa
                const response = await axios.get(`${API_BASE_URL}/operacao/carregaListaComentariosChamado/${idChamado}`, {
                        params: { 
                            ordenacaoPor: ordenacaoPor,  
                            direcaoOrdenacao: direcaoOrdenacao || 'asc',
                            paginaAtual: paginaAtual,
                            itensPorPagina: itensPorPagina
                        }
                    }
                )

                // Mostra lista de comentários transformando a data em padrão brasileiro
                listaComentariosAcordeon.value = response.data.data.map(comentario => ({
                ...comentario,
                    dataComentario: proxy.$formataDataBrasil(comentario.dataComentario)
                }));

                // Atualiza os dados dos colaboradores e o total
                //listaComentariosAcordeon.value = response.data.data
                totalComentariosAcordeon.value = response.data.total
            }

        } catch (erro) {

            // Limpa indicação da carga da lista de comentários
            carregandoComentariosAcordeon.value = false
            
            // Usa a store de erros para exibir o erro
            erroStore.exibirErro(erro)

        } finally {

            // Limpa indicação da carga da lista de comentários
            carregandoComentariosAcordeon.value = false
        }
    }

    
    /* Funções do sistema */

    // Esta função busca os chamados da API e atualiza a tabela
    async function carregaListaChamados() {

        // Blindagem total contra estados intermediários
        const sortArray = Array.isArray(opcoesTabelaChamados.value?.sortBy) 
            ? opcoesTabelaChamados.value.sortBy 
            : []
        
        const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

        // Defaults estáveis (sem jamais acessar [0] de algo indefinido)
        const ordenacaoPor = primeiraOrdenacao?.key ?? 'status'
        const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'asc'

        try {
        
            // Verifica se já está carregando para evitar chamadas concorrentes
            if (carregandoChamados.value == false){

                // Inicia a barra de carregamento
                carregandoChamados.value = true
                
                // Montando o array de status para filtro
                const statusFiltro = [...statusSelecionados.value]

                // Fazendo a requisição para buscar os chamados
                const { data } = await axios.get(`${API_BASE_URL}/operacao/carregaListaChamadosEmpresa/${idEmpresaLogada}`, {
                    params: { 
                        filtroChamados: statusFiltro.join(','),
                        ordenacaoPor: ordenacaoPor,  
                        direcaoOrdenacao: direcaoOrdenacao,
                        idColaborador: idColaborador,
                        textoBusca: textoBusca.value
                    }
                })

                // Verificando se a resposta contém dados
                const retorno = data.retornoApi || []

                // Se houver dados, formatar e atribuir aos headers e chamados
                if (retorno.length > 0) {
                    
                    // Carregando os dados na tabela
                    listaChamados.value = retorno

                    listaChamados.value = retorno.map(chamado => ({
                        ...chamado,
                        existeComentario: chamado.existeComentario ?? chamado.existeComanetario ?? 0,
                        escondeMenu: false
                    }))

                    // Mostra quantidade de chamados
                    contarStatusDosChamados(retorno)
                    
                } else {
                    listaChamados.value = []
                }
            }

        } catch (erro) {  
            
            // Em caso de erro desliga indicador de carregamento e mostra o erro
            carregandoChamados.value = false
            erroStore.exibirErro(erro)      

        } finally {
            carregandoChamados.value = false
        }
    };

    // Esta função carrega os dados do comentário do chamado
    async function criarEditarComentario(item, idComentario = null, origem) {

        // Esconde todos os menus de função da lista se a origem não for modalChamados
        if (origem != 'modalChamados') item.escondeMenu = false;
            
        // Limpa os dados do comentário
        limpaDadosComentario();

        // Verifica se recebeu o código do comentário
        if (idComentario != null && idComentario != 0) {
        
            await axios.put(`${API_BASE_URL}/operacao/comentarioLido/${idComentario}`);
            
            // Esconde o botão salvar comentário
            mostrarBotaoSalvarComentario.value = false

            // Busca os dados do comentário
            const { data } = await axios.get(`${API_BASE_URL}/operacao/buscaComentario/${idComentario}`)

            // Verifica se a resposta contém dados
            const comentarioRecebido = data[0] || {};

            // Carrega os dados do comentário na modal
            Object.assign(modalDadosComentario.value.data, comentarioRecebido);
            
            // Formata a data do comentário para padrão brasileiro
            modalDadosComentario.value.data.dataComentario = proxy.$formataDataBrasil(modalDadosComentario.value.data.dataComentario)

            // Verifica se a resposta é um array indicando que existem arquivos anexados
            if (Array.isArray(comentarioRecebido.arquivosAnexosComentario)) {

                const arquivosExistentes = comentarioRecebido.arquivosAnexosComentario.map(arquivo => ({
                    name: arquivo.name,
                    size: arquivo.size,
                    serverName: arquivo.serverName,
                    path: arquivo.path,
                    isExisting: true,
                    displayName: `${arquivo.name}`,
                    uniqueId: arquivo.uniqueId,
                    raw: null // Arquivos existentes não têm o objeto File original
                }));
                
                // Atualiza a lista completa de arquivos anexados
                arquivosAnexadosComentario.value = [...arquivosExistentes, ...arquivosAnexadosComentario.value.filter(filtro => !filtro.isExisting)];
                
                // Atualize o v-model do v-file-input
                mostraAnexosComentario.value = arquivosExistentes.map(aquivoVfile => ({
                    name: aquivoVfile.name,
                    size: aquivoVfile.size,
                    type: 'application/octet-stream', // Tipo genérico para arquivos existentes
                    lastModified: Date.now()
                }));
            }

        } else {
            
            // Mostra botão salvar comentário
            mostrarBotaoSalvarComentario.value = true

            // Se a origem do chamado foi do modal de chamado busca o id do mesmo em modalDadosChamado.value.data.idChamado
            if (origem != 'modalChamados'){
                modalDadosComentario.value.data.idChamado = item.idChamado
            } else {
                modalDadosComentario.value.data.idChamado = modalDadosChamado.value.data.idChamado
            }

            // Atribui o id do colaborador que está comentando
            modalDadosComentario.value.data.idComentou = idColaborador
        }

        // Torna modal comentários visível
        modalDadosComentario.value.visible = true
    };

    // Função para salvar o comentário do chamado
    async function salvaComentario() {
        
        // Busca texto comentário e limpa eventuais comandos html
        let textoComentario = limpaTextoHtml(modalDadosComentario.value.data.textoComentario.trim())
        
        // Verifica se houve preenchimento do texto
        if (textoComentario == ''){            
            erroStore.exibirErro('Não Foi Digitado Nenhum Comentário') 
            return
        }

        try{

            // Executa upload de arquivos
            const resultadoUpload = await uploadArquivosComentario();
            
            // Se upload não retornou erro, salva os dados dos arquivos anexados
            if (resultadoUpload.status != 'erro') {

                // Extrai apenas os dados necessários
                const dadosAnexos = arquivosAnexadosComentario.value.map(arquivo => ({
                    originalName: arquivo.name,
                    path: arquivo.path,
                    serverName: arquivo.serverName,
                    size: arquivo.size, 
                    uniqueId: arquivo.uniqueId               
                }));

                // Salva os dados dos arquivos anexados
                modalDadosComentario.value.data.arquivosAnexosComentario = dadosAnexos;
            }
            
            // Atualiza o id e nome de quem comentou
            if (modalDadosComentario.value.data.comentarioLido == true) {

                modalDadosComentario.value.data.idQuemLeu = idColaborador
                modalDadosComentario.value.data.nomeQuemLeu = nomeColaborador

            } else {

                modalDadosComentario.value.data.idQuemLeu = 0
                modalDadosComentario.value.data.nomeQuemLeu = ''
            }

            // Busca o id do chamado
            const idChamado = modalDadosComentario.value.data.idChamado;

            // Busca o id do comentário
            const idComentario = modalDadosComentario.value.data.id

            // Converte boolean para 0 ou 1
            modalDadosComentario.value.data.comentarioLido = modalDadosComentario.value.data.comentarioLido ? 1 : 0
    
            // Chama a API para salvar o comentário
            await axios.post(`${API_BASE_URL}/operacao/salvaComentario/${idComentario}`, modalDadosComentario.value.data);

            // Verifica se o modal de chamados está aberto
            if (modalDadosChamado.value.visible == true){

                // Carrega lista comentários do acordeon
                carregarListaComentariosAcordeon();

            } else {

                // Verifica se o chamado já está expandido
                const estadoListaComentarios = chamadosExpandidos.value.indexOf(idChamado)

                // Se já estiver expandido e não for para atualizar comentário, recolhe
                if (estadoListaComentarios !== -1) {
                    chamadosExpandidos.value.splice(estadoListaComentarios, 1)
                }
                
                // Recarrega a lista de chamados
                carregaListaChamados();
            }
            
            // Torna a modal de comentários invisível
            modalDadosComentario.value.visible = false;
                
        } catch(erro){            
            erroStore.exibirErro(erro)
        }
    };

    // Esta função carrega os comentários ou limpa a tabela caso não haja dados
    async function listaComentariosChamado(item, atualizaComentario = false) {

        // Inicializa idChamado
        var idChamado = 0;

        // Verifica se é para atualizar comentário ou expandir/recolher
        if (atualizaComentario == false) {

            // Busca o idChamado do item
            idChamado = item.idChamado || item.idchamado || 0;

            // Esconde todos os menus de função da lista
            item.escondeMenu = false;
        
        } else{
            
            // Se for para atualizar comentário, usa o item como idChamado diretamente
            idChamado = item
        }

        // Verifica se o chamado já está expandido
        const estadoListaComentarios = chamadosExpandidos.value.indexOf(idChamado)

        // Se já estiver expandido e não for para atualizar comentário, recolhe
        if (estadoListaComentarios !== -1 && !atualizaComentario) {

            // Já está expandido → recolhe
            chamadosExpandidos.value.splice(estadoListaComentarios, 1)

        } else {

            try{

                // Expande e carrega comentários
                chamadosExpandidos.value.push(idChamado)

                // Busca a linha do chamado na lista
                const linhaListaChamados = listaChamados.value.find(buscaId => buscaId.idChamado === idChamado)

                // Blindagem contra estados intermediários
                const sortArray = Array.isArray(opcoesTabelaComentarios.value?.sortBy) 
                    ? opcoesTabelaComentarios.value.sortBy 
                    : []
                
                const primeiraOrdenacao = sortArray.length ? sortArray[0] : null

                // // 2) Defaults estáveis (sem jamais acessar [0] de algo indefinido)
                const ordenacaoPor = primeiraOrdenacao?.key ?? 'id'
                const direcaoOrdenacao = primeiraOrdenacao?.order ?? 'desc'
                
                // Extrai paginação
                const paginaAtual = opcoesTabelaComentarios.value.page ?? 1
                const itensPorPagina = opcoesTabelaComentarios.value.itemsPerPage ?? -1

                // Busca os comentários do chamado
                const { data } = await axios.get(`${API_BASE_URL}/operacao/carregaListaComentariosChamado/${idChamado}`, {
                    params: { 
                        ordenacaoPor: ordenacaoPor,  
                        direcaoOrdenacao: direcaoOrdenacao || 'asc',
                        paginaAtual: paginaAtual,
                        itensPorPagina: itensPorPagina
                    }
                })

                // Garante que mesmo sem dados retorne um array
                const retorno = data.data || []

                // Sanitiza cada comentário para ficar em uma única linha
                linhaListaChamados.Comentarios = (retorno || []).map(c => ({
                    ...c, 
                    comentario: c.textoComentario
                    // substitui </p><p> por espaço
                    .replace(/<\/p>\s*<p>/gi, ' ')
                    // remove tags de parágrafo
                    .replace(/<p>|<\/p>/gi, '')
                    // remove quebras de linha via <br>
                    .replace(/<br\s*\/?>/gi, ' ')
                    // compacta múltiplos espaços em apenas um
                    .replace(/\s+/g, ' ')
                    .trim(),
                    dataComentario: proxy.$formataDataBrasil(c.dataComentario) || '',

                }))

            }catch (erro) {
                erroStore.exibirErro(erro)
            }
        }
    };
    
    // Esta rotina carrega produtos, tipos chamados e colaboradores da emrpesa apontada por loginStore.idEmpresa
    async function carregaDadosBasicosChamado(){

        try{

            // Carrega todos produtos
            const { data: dataProdutos } = await axios.get(`${API_BASE_URL}/operacao/buscaProdutosEmpresa/${loginStore.idEmpresa}`)
            
            // Garante que temos um array válido de produtos
            const produtos = Array.isArray(dataProdutos.data) 
                ? dataProdutos.data 
                : dataProdutos.data || []

            // Filtra apenas produtos ativos (ativo = 1)
            const produtosAtivos = produtos.filter(produto => produto.ativo === 1)

            // Carrega os produtos ATIVOS no formato que o v-select precisa
            modalDadosChamado.value.data.produtos = produtosAtivos.map(produto => ({
                value: produto.idProduto,
                title: produto.nome
            }))

            // Busca todos os tipos de chamados
            const { data: dataTiposChamados } = await axios.get(`${API_BASE_URL}/administracao/carregaListaTiposChamado`)
            
            // Garante que temos um array válido de tipos de chamados
            const tipoChamados = Array.isArray(dataTiposChamados.data) 
                ? dataTiposChamados.data 
                : dataTiposChamados.data || []
            
            // Filtra tipos de chamados ativos
            const tiposChamadosAtivos = tipoChamados.filter(tipoChamado => tipoChamado.ativo == 1)

            // Carrega os tipos de chamados no formato que o v-select precisa
            modalDadosChamado.value.data.tipoChamados = tiposChamadosAtivos.map(tipo => ({
                value: tipo.idTipoChamado,
                title: tipo.nome
            })) 
            
            // Carrega colaboradores da empresa que fez login
            const { data: dataUsuarios } = await axios.get(`${API_BASE_URL}/administracao/carregaListaColaboradores/${loginStore.idEmpresa}`)
            
            // Garante que temos um array válido de recursos (colaboradores da empresa apontada por loginStore.idEmpresa)
            const colaboradores = Array.isArray(dataUsuarios.data) 
                ? dataUsuarios.data 
                : dataUsuarios.data || []
            
            // Filtra colaboradores ativos
            const colaboradoresAtivos = colaboradores.filter(recurso => recurso.ativo == 1)
            
                // Transforma os usuários no formato que o v-select precisa
            modalDadosChamado.value.data.nomeColaboradorCliente = colaboradoresAtivos.map(colaborador => ({
                value: colaborador.id,
                title: colaborador.nome
            }))

        } catch(erro){
            erroStore.exibirErro(erro)
        }
    }

    // Esta função mostra ou esconde os campos pendencia e orçamento caso tenham valores
    function mostraPendeciaOrcamento(retornoChamado){

        // Se o campo pendência for diferente de null ou branco mostra a pendência
        if (retornoChamado.pendencia != null && retornoChamado.pendencia != ''){
            mostrarPendencia.value = true
        } else {
            mostrarPendencia.value = false
        }

        // Se o campo pendência for diferente de null ou branco mostra a pendência
        if (retornoChamado.descricaoOrcamento != null && retornoChamado.descricaoOrcamento != ''){
            mostrarDescricaoOrcamento.value = true
        } else {
            mostrarDescricaoOrcamento.value = false
        }    
    }

    // Função para abrir o modal para criar novo chamado
    async function novoChamado(){

        // Limpa dados do formulário
        limpaDadosChamado()
        
        // Desabilita o campo Cliente se o chamado já existir
        desabilitaCampos.value = false;

        desabilitaCampoCliente.value = true;

        try{
        
            // Bucsa no login nome fantasia e id da empresa
            modalDadosChamado.value.data.Cliente = nomeEmpresaLogada
            modalDadosChamado.value.data.idEmpresa = idEmpresaLogada
            
            // Carrega produtos, tipos chamados e colaboradores da emrpesa
            await carregaDadosBasicosChamado()
            
            // Exibe o modal com os dados do chamado
            modalDadosChamado.value.visible = true

            // Mostra botão salvar
            mostrarBotaoSalvarChamado.value = true

        }catch (erro) {
            erroStore.exibirErro(erro)
        }   
    };

    // Muda status do orçamento para aceito ou rejeitado
    async function trataOrcamento(item, status){

        try{

            // Chama api para mudar o status do chamado
            const { salvaStatusOrcamento } = await axios.put(`${API_BASE_URL}/operacao/alteraStatusOrcamento/${item.idChamado}`, {
                status: status
            })

            // Recarrega a lista de chamados
            carregaListaChamados()

        } catch(erro){
            erroStore.exibirErro(erro)
        }
    }
    
    // Função para buscar dados de um chamado específico
    async function editaDadosChamado(item) {

        try {

            // Busca o idChamado do item, considerando possíveis variações de nome
            const idChamado = item.idChamado || item.idchamado || 0;

            // Esconde todos os menus de função da lista
            item.escondeMenu = false;
            
            // Limpa dados do formulário        
            limpaDadosChamado()

            // Busca os dados do chamado específico por idChamado
            const { data: dataChamado } = await axios.get(`${API_BASE_URL}/operacao/buscaDadosChamadoId/${idChamado}`)
            const retornoChamado = dataChamado[0] || {}
            
            if (!retornoChamado) {
                erroStore.exibirErro('Chamado Não Encontrado')
                return
            }
            
            // Conforme o status do chamado mostra os campos executado, pendente e orçamento
            if (retornoChamado.status == 'ABERTO'){

                mostraAcordeonComantarios.value = false
                mostrarExecutado.value = false
                mostrarPendencia.value = false
                mostrarDescricaoOrcamento.value = false

            } else if (retornoChamado.status == 'CONCLUIDO'){

                // Esconde acordeon de comentários
                mostraAcordeonComantarios.value = false
                
                // Mostra campo execução
                mostrarExecutado.value = true

                // Mostra ou esconde os campos pendencia e orçamento
                mostraPendeciaOrcamento(retornoChamado)

            } else if (retornoChamado.status == 'PENDENTE CLIENTE'){

                // Mostra o acordeon de comentários
                mostraAcordeonComantarios.value = true
                
                // Mostra ou esconde os campos pendencia e orçamento
                mostraPendeciaOrcamento(retornoChamado)

            } else if (retornoChamado.status == 'ORCAMENTO' || 
                       retornoChamado.status == 'ORCAMENTO APROVADO' || 
                       retornoChamado.status == 'ORCAMENTO REJEITADO'){

                // Ativa comentários se o chamado está em orçamento, aprovado ou rejeitado
                mostraAcordeonComantarios.value = true
                
                // Mostra ou esconde os campos pendencia e orçamento
                mostraPendeciaOrcamento(retornoChamado)                
            }            

            // Salva código do cliente
            modalDadosChamado.value.data.idChamado = idChamado

            // Salva tempo do chamado
            modalDadosChamado.value.data.tempoExecucao = retornoChamado.tempoExecucao            
            
            // Salva id da empresa
            modalDadosChamado.value.data.idEmpresa = retornoChamado.idEmpresa
            
            // Carrega nome do cliente e cidade
            modalDadosChamado.value.data.Cliente = retornoChamado.Cliente;

            // Carrega produtos, tipos chamados e colaboradores da emrpesa
            await carregaDadosBasicosChamado()
            
            // Aponta para o colaborador que abriu o chamado
            modalDadosChamado.value.data.idAbriuChamado = retornoChamado.idAbriuChamado

            // Aponta o produto do chamado
            modalDadosChamado.value.data.idProduto = retornoChamado.idProduto
            
            // Aponta para o produto do chamado
            modalDadosChamado.value.data.idTipoChamado = retornoChamado.idTipoChamado

            // Mostra o status do chamado ou 'ABERTO'
            modalDadosChamado.value.data.status = retornoChamado.status !== null ? retornoChamado.status : 'ABERTO';

            // Mostra data de abertura
            modalDadosChamado.value.data.dataAbertura = proxy.$formataDataBrasil(retornoChamado.dataAbertura)
            
            // Mostra data de execução
            modalDadosChamado.value.data.dataExecucao = proxy.$formataDataBrasil(retornoChamado.dataExecucao);
            
            // Mostra data de conclusão
            modalDadosChamado.value.data.dataConclusao = proxy.$formataDataBrasil(retornoChamado.dataConclusao);
            
            // Mostra data de pendência
            modalDadosChamado.value.data.dataPendencia = proxy.$formataDataBrasil(retornoChamado.dataPendencia);

            // Mostra data de previsão
            modalDadosChamado.value.data.dataPrevisao = proxy.$formataDataBrasil(retornoChamado.dataPrevisao);                
            
            // Mostra o que foi solicitado
            modalDadosChamado.value.data.solicitado = retornoChamado.solicitado
            
            // Mostra o que foi executado
            modalDadosChamado.value.data.executado = retornoChamado.executado
            
            // Mostra a pendencia
            modalDadosChamado.value.data.pendencia = retornoChamado.pendencia

            // Mostra descrição do orçamento
            modalDadosChamado.value.data.descricaoOrcamento = retornoChamado.descricaoOrcamento

            // Mostra valor do orçamento
            modalDadosChamado.value.data.custoOrcamento = Number(retornoChamado.custoOrcamento).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            // Mostra se orcamento foi liberado
            modalDadosChamado.value.data.orcamentoLiberado = retornoChamado.orcamentoLiberado == 1

            // Atualiza a prioridade
            const prioridadeValida = dadosPrioridade.some(item => item.value === retornoChamado.prioridade)
            modalDadosChamado.value.data.prioridade = prioridadeValida ? retornoChamado.prioridade : 'BAIXA'
            
            // Verifica se a resposta é um array indicando que existem arquivos anexados
            if (Array.isArray(retornoChamado.arquivosAnexosChamado)) {

                const arquivosExistentes = retornoChamado.arquivosAnexosChamado.map(arquivo => ({
                    name: arquivo.name,
                    size: arquivo.size,
                    serverName: arquivo.serverName,
                    path: arquivo.path,
                    isExisting: true,
                    displayName: `${arquivo.name}`,
                    uniqueId: arquivo.uniqueId,
                    raw: null // Arquivos existentes não têm o objeto File original
                }));
                
                // uploadedFiles.value = arquivosExistentes;
                arquivosAnexadosChamado.value = [...arquivosExistentes, ...arquivosAnexadosChamado.value.filter(filtro => !filtro.isExisting)];
                
                // Atualize o v-model do v-file-input
                mostraAnexosChamado.value = arquivosExistentes.map(aquivoVfile => ({
                    name: aquivoVfile.name,
                    size: aquivoVfile.size,
                    type: 'application/octet-stream', // Tipo genérico para arquivos existentes
                    lastModified: Date.now()
                }));
            }

            // Desabilita o campo Cliente se o chamado já existir
            desabilitaCampos.value = true;

            mostrarBotaoSalvarChamado.value = false
            
            // Exibe o modal com os dados do chamado
            modalDadosChamado.value.visible = true

        } catch (erro) {
            erroStore.exibirErro(erro)
        }
    };

    // Esta função cria um novo chamado ou edita um chamado existente
    async function salvaChamado() {
        
        try {

            // Verifica se o solicitante foi selecionado
            if (modalDadosChamado.value.data.idAbriuChamado == ''){                
                erroStore.exibirErro('Selecione Solicitante')
                return
            }

            // Verifica se o produto foi selecionado
            if (modalDadosChamado.value.data.idProduto == ''){                
                erroStore.exibirErro('Selecione Produto Origem do Chamado')
                return
            }

            // Verifica se o tipo de chamado foi selecionado
            if (modalDadosChamado.value.data.idTipoChamado == ''){                
                erroStore.exibirErro('Selecione Tipo de Chamado')
                return
            }
            
            // Verifica se foi digitado o que foi solicitado            
            if (modalDadosChamado.value.data.solicitado == ''){                
                erroStore.exibirErro('Entre Com Solicitação do Chamado')
                return
            }

            // Se o orçamento foi liberado muda o status para orcamento aprocado
            if (modalDadosChamado.value.data.orcamentoLiberado == true){
                modalDadosChamado.value.data.status = 'ORCAMENTO APROVADO'
            } else if (modalDadosChamado.value.data.status == 'ORCAMENTO APROVADO') {
                modalDadosChamado.value.data.status = 'ORCAMENTO REJEITADO'
            }
            
            // Salva condição do orçamento
            modalDadosChamado.value.data.orcamentoLiberado = modalDadosChamado.value.data.orcamentoLiberado ? 1 : 0

            // Salva custo do orçamento para retornar formatado caso ocorra erro
            var salvaCustoOrcamento = modalDadosChamado.value.data.custoOrcamento

            if (salvaCustoOrcamento != 0){

                // Formata o custo do orcamento para salvar no banco
                modalDadosChamado.value.data.custoOrcamento = salvaCustoOrcamento
                                                                .replace('R$', '')
                                                                .replace(/\./g, '')
                                                                .replace(',', '.')
                                                                .trim();   
            }
            // Executa upload de arquivos
            const resultadoUpload = await uploadArquivosChamado();
            
            // Se upload não retornou erro, salva os dados dos arquivos anexados
            if (resultadoUpload.status != 'erro') {

                // Extrai apenas os dados necessários
                const dadosAnexos = arquivosAnexadosChamado.value.map(arquivo => ({
                    originalName: arquivo.name,
                    path: arquivo.path,
                    serverName: arquivo.serverName,
                    size: arquivo.size, 
                    uniqueId: arquivo.uniqueId               
                }));

                // Salva os dados dos arquivos anexados
                modalDadosChamado.value.data.arquivosAnexosChamado = dadosAnexos;
            }

            const idChamadoSalvar = modalDadosChamado.value.data.idChamado;

            // Chama API para salvar os dados do chamado
            const resposta = await axios.post(`${API_BASE_URL}/operacao/salvaChamadoCliente/${idChamadoSalvar}`, modalDadosChamado.value.data);

            // Salva id do chamado
            modalDadosChamado.value.data.idChamado = resposta.data.idChamado;

            // Salva o id do chamado na variável reativa para mostrar o acordeon de comentários
            mostraAcordeonComantarios.value = false;

            // Fechar o modal e recarregar a lista de chamados
            fecharModalChamados();

            // Carrega lista de chamados
            await carregaListaChamados()

        } catch (erro) {

            modalDadosChamado.value.data.custoOrcamento = salvaCustoOrcamento
            erroStore.exibirErro(erro)
        }
    }; 

    // Função para tratar a digitação no campo de cliente
    async function autoCompletaNomeCliente() {
        
        const textoDigitado = modalDadosChamado.value.data.Cliente
        if (textoDigitado.length < 2) {
            sugestoes.value = []
            return
        }

        try {

            const resposta = await axios.get(`${API_BASE_URL}/operacao/autoCompletaCliente`, {
                params: { termo: textoDigitado }
            })

            // Simula busca filtrando clientes que combinam com o termo
            sugestoes.value = resposta.data
            .filter(cliente =>
                cliente.nomeFantasia?.toLowerCase().includes(textoDigitado.toLowerCase())
            )
            .map(cliente => ({
                id: cliente.id,
                nome: cliente.nomeFantasia
            }))

        } catch (erro) {
            erroStore.exibirErro(erro)
        }        
    }

    // Esta função é chamada quando um cliente é selecionado na lista do resultado
    // da função de autocompleta
    async function selecionarCliente(cliente) {

        try{

            // Atualiza o campo visível com o nome
            modalDadosChamado.value.data.Cliente = cliente.nome

            // Armazena o ID do cliente escolhido, se for necessário para outra lógica
            modalDadosChamado.value.data.idEmpresa = cliente.id

            // Busca todos contatos do cliente (solicitantes)
            const { data: dataContatos } = await axios.get(`${API_BASE_URL}/operacao/buscaColaboradoresCliente/${cliente.id}`)
            const contatos = Array.isArray(dataContatos) ? dataContatos : dataApi.retornoApi || []
            
            // Transforma os contatos no formato que o v-select precisa
            modalDadosChamado.value.data.nomeColaboradorCliente = contatos.map(contato => ({
                value: contato.id, 
                title: contato.nome
            }))

        } catch (erro) {
            erroStore.exibirErro(erro)
        }   

        // Limpa e esconde as sugestões
        sugestoes.value = []
    }
        
    // Esta rotina limpa os dados do formulário modal de chamados
    function limpaDadosChamado() {

        const dataHoraAtual = new Date();
        
        modalDadosChamado.value.visible = false
        
        Object.assign(modalDadosChamado.value.data, {
            idChamado: 0,
            Cliente: '',
            idEmpresa: '',
            idAbriuChamado: [],
            nomeColaboradorCliente: '',
            idProduto: [],
            produtos: '',
            idTipoChamado: [],
            tipoChamados: '',
            status: 'ABERTO',
            prioridade: 'BAIXA',
            solicitado: '',
            executado: '',
            pendencia: '',
            dataAbertura: proxy.$formataDataBrasil(dataHoraAtual),
            dataExecucao: '',
            dataConclusao: '',
            dataPendencia: '',
            dataPrevisao: '',
            dataOrcamento: '',
            ordemExibicao: 0,
            descricaoOrcamento: '',
            custoOrcamento: 0,
            orcamentoLiberado: 0,
            arquivosAnexosChamado: []
        })

        // Torna invisível o campo descrição do orçamento
        mostrarDescricaoOrcamento.value = false;

        // Limpa elemento de upload de arquivos
        arquivosAnexadosChamado.value = [];

        // Zera valor da variável reativo contendo a lista de comentários
        mostraAcordeonComantarios.value = false
        
        acordeonComentarios.value = null
    };
    
    //Esta rotina limpa os dados do formulário modal de comentários
    function limpaDadosComentario() {

        // Pega data atual em formato ISO 8601
        const dataAtual = proxy.$formataDataBrasil(new Date().toISOString());
        
        // Fecha o modal
        modalDadosComentario.value.visible = false
        
        // Limpa os dados do formulário
        Object.assign(modalDadosComentario.value.data, {
            id: 0,
            idChamado: 0,
            idComentou: 0,
            idQuemLeu: 0,
            textoComentario: '',
            dataComentario: dataAtual,
            nomeQuemComentou: '',
            nomeQuemLeu: '',
            comentarioLido: false,
            arquivosAnexosComentario: []
        })

        // Limpa elemento de upload de arquivos
        arquivosAnexadosComentario.value = [];
        mostraAnexosComentario.value = [];
        
        // Habilita o botão porque não existe comentário
        desabilitarSalvarModalComentarios.value = false;
    };

    // Função para fechar todos os menus
    function fecharModalChamados() {
        modalDadosChamado.value.visible = false
    };

    function fecharModalComentario() {
        modalDadosComentario.value.visible = false
    };

    // Esta fução trata da expansão do chamado ao se clicar no ícone de comentários
    function linhaComentarios(codigo) {
        return chamadosExpandidos.value.includes(codigo)
    };

    // Chama formulário modal para alterar a senha   
    function mudarSenha() {
        alert('Função de mudar senha em desenvolvimento')
    }

    // Esta função converte tempo hhh:mm em horas
    function converterTempoParaHoras(tempoStr) {

        const [hStr, mStr] = tempoStr.split(':');
        const horas = parseInt(hStr) || 0;
        const minutos = parseInt(mStr) || 0;
        return horas + minutos / 60;
    }

    // Atualiza custo do chamado usando o valor do tempo do chamado
    function atualizarCustoTotal() {

        // Busca tempo do chamado
        const tempoStr = modalDadosChamado.value.data.tempoExecucao;
        
        // Entra na rotina se o tempo do chamado foi expecificado
        if (tempoStr){

            // Converte o tempo em horas
            const horasTotais = converterTempoParaHoras(tempoStr);

            // Filtra somente  usuários selecionados
            const colaboradoresSelecionados = modalDadosChamado.value.data.nomeColaboradorSuporte.filter(colaboradorSuporte =>
                modalDadosChamado.value.data.idColaboradorSuporte.includes(colaboradorSuporte.value)
            );

            // Soma os valores da hora de cada usuário
            const somaValorHora = colaboradoresSelecionados.reduce(
                (total, colaboradoresSelecionados) => total + (colaboradoresSelecionados.valorHora || 0), 0
            );

            // Multiplica pelo número de horas
            custoCalculoChamado = somaValorHora * horasTotais;

            // Monta mascara do valor retornado do calculo
            modalDadosChamado.value.data.custoChamado = custoCalculoChamado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }
    }

    // Função para selecionar linha
    function selecionarLinha(codigo) {
        linhaSelecionada.value = linhaSelecionada.value.includes(codigo) ? [] : [codigo]
    }

    // Função para calcular a diferença entre duas datas com horas e minutos
    function diferencaComHora(data1Str, data2Str) {

        const [data1, hora1] = data1Str.split(' ');
        const [dia1, mes1, ano1] = data1.split('/');
        const [h1, min1] = hora1.split(':');

        const [data2, hora2] = data2Str.split(' ');
        const [dia2, mes2, ano2] = data2.split('/');
        const [h2, min2] = hora2.split(':');

        const dt1 = new Date(ano1, mes1 - 1, dia1, h1, min1);
        const dt2 = new Date(ano2, mes2 - 1, dia2, h2, min2);

        const diffMs = dt2 - dt1;
        const totalMin = Math.floor(diffMs / (1000 * 60));
        let horas = Math.floor(totalMin / 60);
        let minutos = totalMin % 60;

        // Formatando com 2 dígitos
        horas = String(horas).padStart(2, '0');
        minutos = String(minutos).padStart(2, '0');

        return { horas, minutos };
    }
    
    // Limpa texto de comando html
    function limpaTextoHtml(textoEntrada){
        
        const html = textoEntrada || ''
        
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || ''    
    }

    // Retorna a cor associada ao status do chamado
    function statusColor(status) {
        switch (status) {
            case 'ABERTO': return 'blue'
            case 'PENDENTE': return 'red'
            case 'PENDENTE CLIENTE': return 'orange'
            case 'CONCLUÍDO': return 'green'
            case 'ORÇAMENTO': return 'yelow'
            case 'ORÇAMENTO APROVADO': return 'yelow'
            default:
            return 'black'
        }
    }

    // Funções com verificação de segurança
    function buscaTitulo(valor) {
        if (!valor) return ''
        const opcao = opcoesStatus.value.find(op => op.value === valor)
        return opcao ? opcao.title : valor
    }
    
    // Função para buscar 
    function getChipColor(valor) {
        if (!valor) return 'grey'
        const cores = {
            'ABERTO': 'orange',
            'EXECUCAO': 'blue',
            'PENDENTE': 'red',
            'PENDENTE CLIENTE': 'deep-orange',
            'ORCAMENTO': 'green',
            'ORCAMENTO APROVADO': 'green',
            'ORCAMENTO REJEITADO': 'grey',
            'CONCLUIDO': 'teal'
        }
        return cores[valor] || 'grey'
    }

    // Busca valor de cada staus
    function buscaContagem(valor) {
        
        if (!valor) {            
            return 0
        }

        return contagemStatus.value[valor] || 0
    }

    // Função chamada quando o botão para remover um status é pressionado
    function removerStatus(status) {
        
        if (!status) return
        statusSelecionados.value = statusSelecionados.value.filter(s => s !== status)
    }

    // Esta função faz a contagem de chamados para cada status
    function contarStatusDosChamados(chamados) {

        // Inicializa todas as contagens como 0
        const novaContagem = {}

        // Zera todos os status
        opcoesStatus.value.forEach(status => {
            novaContagem[status.value] = 0
        })
        
        // Conta cada status do chamado
        chamados.forEach(chamado => {
            novaContagem[chamado.Status]++
        })
        
        // Atualiza a variável reativa
        contagemStatus.value = novaContagem
        
        // Retorna com o valor da contage,
        return novaContagem
    }

    // Se o campo foi limpo, recarrega a lista de chamados        
    function atualizaParamentrosBusca(novoValor) {
        if (!novoValor) {
            carregaListaChamados()
        }
    }
    
    // Carrega a lista de chamados quando o formulário ChamadosTable for montado
    // Esta função é chamada quando o formulário é carregado
    onMounted(() => {

        // Verifica se não está logado
        if (!autorizacaoLogin.estaLogado){
            
            // Carrega formulário de login
            router.push({ name: 'Login' })

        } else {

            // Carregalista de chamados
            carregaListaChamados()
        }
    })

    // Esta rotina é disparada quando o modal é aberto ou fechado
    watch(() => modalDadosChamado.value.visible, async (valor) => {
        modalChamadoAberto = valor
    })

    // Monitora o campo status e se a condição mudar para aberto limpa os calendários, tempo do chamado e custo do orçamento
    watch(
        () => modalDadosChamado.value.data.status,
        () => {

            // Se o modal ainda não estiver carregado sai da rotina
            if (!modalChamadoAberto) return;

            // Busca a data e hora atuais no formato brasileiro
            const dataHoraAtual = new Date();
                
            // Se o status for aberto coloca a data atual no campo data abertura e limpa o restante dos campos de horarios, tempo de chamado e custo 
            if (modalDadosChamado.value.data.status === 'ABERTO') {

                modalDadosChamado.value.data.dataAbertura = proxy.$formataDataBrasil(dataHoraAtual)
                modalDadosChamado.value.data.dataPrevisao = null
                modalDadosChamado.value.data.dataExecucao = null
                modalDadosChamado.value.data.dataConclusao = null
                modalDadosChamado.value.data.dataPendencia = null
                modalDadosChamado.value.data.tempoExecucao = ''
                modalDadosChamado.value.data.custoChamado = '0,00'
                mostrarDescricaoOrcamento.value = false;

            // Se o status for execução coloca a data atual no campo de data execução
            } else if (modalDadosChamado.value.data.status === 'EXECUCAO') {
            
                modalDadosChamado.value.data.dataExecucao = proxy.$formataDataBrasil(dataHoraAtual)
                mostrarDescricaoOrcamento.value = false;

            } else if (modalDadosChamado.value.data.status === 'PENDENTE' ||
                       modalDadosChamado.value.data.status === 'PENDENTE CLIENTE') {
            
                modalDadosChamado.value.data.dataPendencia = proxy.$formataDataBrasil(dataHoraAtual)
                modalDadosChamado.value.data.dataConclusao = null
                modalDadosChamado.value.data.tempoExecucao = ''
                modalDadosChamado.value.data.custoChamado = '0,00'

                // Se o status do chamado for concluído e houver uma data de execução, calcula o tempo do chamado
            } else if (modalDadosChamado.value.data.status === 'CONCLUIDO' && modalDadosChamado.value.data.dataExecucao) {
            
                // Se ainda não tiver uma data de conclusão assume a data e hora atual
                if (!modalDadosChamado.value.data.dataConclusao){
                    modalDadosChamado.value.data.dataConclusao = proxy.$formataDataBrasil(dataHoraAtual);
                }

                // Calcula a diferença entre a data de execução e conclusão
                const resultadoDiferenca = diferencaComHora(modalDadosChamado.value.data.dataExecucao, modalDadosChamado.value.data.dataConclusao)
                
                // Insere diferença entre a hora de execução e conclusão no campo de tempo de chamado
                modalDadosChamado.value.data.tempoExecucao = `${resultadoDiferenca.horas}:${resultadoDiferenca.minutos}`  

                mostrarDescricaoOrcamento.value = false;
                              
            } else if (modalDadosChamado.value.data.status === 'ORCAMENTO' ||
                       modalDadosChamado.value.data.status === 'ORCAMENTO APROVADO' ||
                       modalDadosChamado.value.data.status === 'ORCAMENTO REJEITADO') {
                
                mostrarDescricaoOrcamento.value = true;

            } else {
                
                mostrarDescricaoOrcamento.value = false;
            }
        },
        { deep: true }
    );
    
    // Monitora a mudança de recursos e recalcula o custo do chamado se estiver com status de concluído
    watch(
        
        () => modalDadosChamado.value?.data?.idColaborador,
        () => {
            
            // Se o modal ainda não estiver carregado sai da rotina
            if (!modalChamadoAberto) return;

            // Verifica se o chamado já está concluido 
            if (modalDadosChamado.value.data.status == 'CONCLUIDO' ){

                // Calcula o custo do chamado se o campo tempoExecucao estiver com algum valor
                atualizarCustoTotal();                
            }
        },
        { deep: true } // observa arrays reativos
    );

    // Monitora a mudança no tempo do chamado
    watch(

        () => modalDadosChamado.value.data.tempoExecucao,
        (novoValor, valorAntigo) => {
        
            // Se o modal ainda não estiver carregado sai da rotina
            if (!modalChamadoAberto) return;

            // Verifica se a variável tem um valor válido
            if (novoValor === '' || novoValor === 'NaN:NaN' || novoValor === null){
                modalDadosChamado.value.data.custoChamado = '0,00'
                return
            }
            
            // Atualiza custo do chamado
            atualizarCustoTotal();
        }
    )

    // Monitora a data de conclusão do chamado para calcular o tempo do mesmo
    watch(
        () => modalDadosChamado.value.data.dataConclusao,
        () => {

            if (!modalChamadoAberto) return;

            if (modalDadosChamado.value.data.status === 'CONCLUIDO' && modalDadosChamado.value.data.dataExecucao) {
            
                const resultadoDiferenca = diferencaComHora(modalDadosChamado.value.data.dataExecucao, modalDadosChamado.value.data.dataConclusao)
                
                // Insere diferença entre a hora de execução e conclusão no campo de tempo de chamado
                modalDadosChamado.value.data.tempoExecucao = `${resultadoDiferenca.horas}:${resultadoDiferenca.minutos}`                
            }
        },
        { deep: true }
    );
        
    // Observa mudanças no acordeão para carregar colaboradores quando aberto
    watch(acordeonComentarios, (val) => {
        
        if (Array.isArray(val)) {
            
            if (val.includes(0)) {
                carregarListaComentariosAcordeon()
            }
            
        } else if (val === 0) {
            carregarListaComentariosAcordeon()
        }
    })    
    
</script>

<style>

    .blink-color-status {
        animation: blink-color-status 1s infinite;
    }

    @keyframes blink-color-status {
        0%   { background-color: #f32121; color: white; }
        50%  { background-color: rgb(2, 69, 253); color: #ffffff; }
        100% { background-color: #f3de21; color: white; }
    }

    .tabela-fixa {
       table-layout: fixed;
    }

    .linha-chamado-selecionada {
        background-color: #e6e6e6;
        color: rgb(15, 15, 15);
    }

    tr {
        cursor: pointer;
    }

    .col-codigo a {
        color: inherit;
        text-decoration: none;
        font-weight: bold;
    }

    .col-codigo a:hover {
        text-decoration: underline;
        color: #1976d2;
    }
    
    .menu-hover {
        transition: background-color 0.3s ease;
        border-radius: 4px;
    }

    .menu-hover:hover {
        background-color: #94cdf7; /* azul claro */
        color: white !important;        
        color: black !important;
    }

    .tabela-com-divisores {
        table-layout: fixed;
    }

    .tabela-com-divisores td,
    .tabela-com-divisores th {
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }

    .tabela-com-divisores td:last-child,
    .tabela-com-divisores th:last-child {
        border-right: none;
    }

    .rounded-button {
        border-radius: 50%;
    }

    .botao-circulo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #007bff;
        color: white;
        border: none;
        font-size: 18px;
        cursor: pointer;
    }
    .botao-circulo:hover {
        background-color: #0056b3;
    }

    .blinkIcone {
        animation: blink-color-status 1s infinite;
    }

    @keyframes blinkIcone {
        0%   { background-color: #f32121; color: white; }
        50%  { background-color: rgb(2, 69, 253); color: #ffffff; }
        100% { background-color: #f3de21; color: white; }
    }
    
</style>

<style scoped>

    .linha-comentario-selecionada {
        background-color: white !important;
    }

    .botao-circulo {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .v-icon {
        font-size: 20px;
    }

    .btn-icon {
        width: 42px;
        height: 42px;
    }

    .btn-icon:hover {
        background-color: #f0f0f0;
        border-radius: 4px;
    }

    .accordion-container {
        width: 100%;
        margin-top: 16px;
    }

    .accordion-toggle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #eee;
        border: none;
        padding: 12px 16px;
        font-weight: bold;
        cursor: pointer;
    }

    .accordion-content {
        padding: 12px 16px;
        background-color: #f9f9f9;
        border-top: 1px solid #ccc;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .btn-verde {
        margin-top: 12px;
        background-color: #4CAF50;
        color: white;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        cursor: pointer;
    }

    .editor {
        margin-top: 16px;
    }

    :deep(.ql-editor) {
    padding: 0;
    }

    :deep(.comentario) {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
    }

    :deep(.cabecalho-comentario) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    :deep(.autor) {
        font-weight: bold;
        color: #1976d2; /* Cor primária do Vuetify */
    }

    :deep(.data) {
        color: #616161; /* Cinza médio */
    }

    :deep(.conteudo) {
    line-height: 1.6;
    margin-left: 0.5rem;
    }

    :deep(.separador) {
        border: none;
        border-top: 1px dashed #e0e0e0;
        margin: 1rem 0;
    }

    :deep(.erro) {
        color: #d32f2f;
        padding: 0.5rem;
        background-color: #ffebee;
        border-radius: 4px;
    }

    /* Estilos upload */
    .file-upload {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .file-input {
        display: none;
    }

    .upload-button {
        margin: 10px 5px;
        padding: 8px 16px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .upload-button:hover {
        background-color: #3aa876;
    }

    .upload-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .file-list {
        margin-top: 20px;
    }

    .file-list ul {
        list-style: none;
        padding: 0;
    }

    .file-list li {
        padding: 8px;
        margin: 5px 0;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .remove-button {
        background: none;
        border: none;
        color: #ff4444;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0 5px;
    }

    .progress-container {
        margin-top: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .progress-container progress {
        flex-grow: 1;
    }

    .message {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        background-color: #dff0d8;
        color: #3c763d;
    }

    .message.error {
        background-color: #f2dede;
        color: #a94442;
    }

    .v-chip--primary {
        cursor: pointer;
    }

    .custom-switch ::v-deep(.v-label) {
        font-size: 14px;
    }

    /* Estilos para a tabela de comentários */
    .comentarios-table {
        width: 100%;
        table-layout: fixed;    /* respeita larguras fixas se houver */
        border-collapse: collapse;  /* faz as bordas “se tocarem” sem espaços */
    }

    /* Bordas horizontais: uma linha preta embaixo de cada célula do corpo */
    .comentarios-table tbody td {
        border-bottom: 1px solid #b4a4a4;
        padding: 8px 12px;      /* ajuste seu padding conforme o design */
    }

    /* Opcional: linha separadora abaixo do cabeçalho */
    .comentarios-table thead th {
        border-bottom: 2px solid #b4a4a4;
        padding: 8px 12px;
    }

    /* Remove a última linha horizontal (evita borda extra no final) */
    .comentarios-table tbody tr:last-child td {
        border-bottom: none;
    }
    
</style>
