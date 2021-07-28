import React from "react";
import Link from "next/link";
/* Ao invés de definir a estilização via Next nesse componente, igual
todos os outros importados aqui, esse é o componente Master/Pai de todos,
o qual não contém estilização própria, apenas a que já está definida nos outros
componentes, aqui importados 😉😁: 

Ou seja, trazendo isso pro Atomic Design, esse seria uma
*/
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import InfoBox from "../src/components/InfoBox";
/* Importando a biblioteca de Cookies para o SSR de página: */
import nookies from "nookies";
/* Importando a biblioteca pra decodificar 
as infos do token, que está dentro do cookie: */
import jwt from "jsonwebtoken";
import { checkUserAuth } from "../src/hooks/checkUserAuth";

/* Componente ProfileRelations: */
function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {/* Mostra a quantidade de items na array: */}
        {props.title} ({props.items.length}):
      </h2>

      {/*  */}
    </ProfileRelationsBoxWrapper>
  );
}

//Componente principal DENTRO desse componente Master:
export default function Home(props) {
  const [scraps, setScraps] = React.useState([]);
  const [formOption, setFormOption] = React.useState(0);

  const [communityTitle, setCommunityTitle] = React.useState("");
  const [communityImage, setCommunityImage] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [isCreatingCommunity, setIsCreatingCommunity] = React.useState(false);
  const [isCreatingScrap, setIsCreatingScrap] = React.useState(false);

  /* Essa é a var que representa você 😁 =
  O user da rede social Alurakut. Sendo o seu nome,
  o mesmo nome do seu usuário do GitHub, pois assim,
  pesquisamos seu nome na API do GitHub, e exibimos
  a foto definida no seu perfil do GitHub! :D */
  const user = props.githubUser; /* Definido lá embaixo
  nesse arquivo, utilizando o SSR */

  /* Pega a bio do User no GitHub: */
  const [userInfo, setUserInfo] = React.useState({});
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${user}`)
      .then((res) => res.json())
      .then((data) =>
        setUserInfo({
          name: data.name,
          bio: data.bio,
          location: data.location,
          createdAt: data.created_at
        })
      )
      .catch((error) => console.error(error));
  }, []);

  /* Essa é a array com os outros usuários exibidos
  na sua comunidade ;D Podendo ser eles, seus seguidores,
  amigos, etc: */
  const [seguindo, setSeguindo] = React.useState([]);
  /* Pega as pessoas que você segue no GitHub*/
  React.useEffect(function () {
    fetch(`https://api.github.com/users/${user}/following`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguindo(respostaJSON);
      });
  }, []);
  //Var pra mostrar mais ou menos "seguindo":
  const [isShowingMoreSeguindo, setIsShowingMoreSeguindo] =
    React.useState(false);

  /* Cria a var de seguidores, com o estado inicial já sendo uma array vazia,
  e a var pra alterar o estado da array de comunidades: */
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    //Pega os dados dos seguidores do usuário
    fetch(`https://api.github.com/users/${user}/followers`)
      .then(function (respostaServer) {
        return respostaServer.json();
      })
      .then(function (respostaJSON) {
        setSeguidores(respostaJSON);
      });
  }, []);
  //Var pra mostrar mais ou menos "seguidores":
  const [isShowingMoreSeguidores, setIsShowingMoreSeguidores] =
    React.useState(false);

  /* Cria a var de comunidades, com o estado inicial sendo uma array vazia,
  e a var pra alterar o estado da array de comunidades: */
  const [comunidades, setComunidades] = React.useState([]);

  /* Pega a array de dados do GitHub: */
  React.useEffect(function () {
    //API GraphQL, no Dato CMS:
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "f498efcb034b6dd6f8a6ac46cdae8e",
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      /* Retorna no JSON, as infos: */
      body: JSON.stringify({
        query: `query {
        allComunidades {
          id 
          title
          imageurl
          creatorSlug
        }
      }`
      })
    })
      .then((serverResponse) => serverResponse.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        /* Retorna a resposta do servidor
        já transformada em JSON: */
        const comunidadesDatoCMS = respostaCompleta.data.allComunidades;
        /* console.log(comunidadesDatoCMS); */
        setComunidades(comunidadesDatoCMS);
      });
  }, []);
  //Var pra mostrar mais ou menos "comunidades":
  const [isShowingMoreComunidades, setIsShowingMoreComunidades] =
    React.useState(false);

  /* Função que dá o toggle 
  nas vars pra mostrar mais ou não: */
  function toggleShowMoreSeguidores(e) {
    e.preventDefault();
    setIsShowingMoreSeguidores(!isShowingMoreSeguidores);
  }
  function toggleShowMoreSeguindo(e) {
    e.preventDefault();
    setIsShowingMoreSeguindo(!isShowingMoreSeguindo);
  }
  function toggleShowMoreComunidades(e) {
    e.preventDefault();
    setIsShowingMoreComunidades(!isShowingMoreComunidades);
  }

  return (
    <>
      {/* Importa o Header/Menu existente lá em "src\lib\AlurakutCommons.js": */}
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <Box as="aside">
            <img
              src={`https://github.com/${user}.png`}
              style={{ borderRadius: "8px" }}
            />

            <hr />

            <p>
              <a
                className="boxLink"
                href={`https://github.com/${user}`}
                target="_blank"
              >
                @{user}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault githubUser={user} />
          </Box>
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title subPageTitle">
              Bem-vindo(a), {userInfo.name === null ? user : userInfo.name}
            </h1>
            <p className="bio">{userInfo.bio}</p>

            <OrkutNostalgicIconSet confiavel={3} legal={3} sexy={3} />

            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnCenter">Região:</td>
                  <td>{userInfo.location}</td>
                </tr>
                <tr>
                  <td className="textOnCenter">Membro desde:</td>
                  <td>{new Date(userInfo.createdAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </InfoBox>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <div className="optionButtons">
              <button onClick={() => setFormOption(0)}>Criar comunidade</button>
              <button onClick={() => setFormOption(1)}>Deixar um recado</button>
            </div>
            {formOption === 0 ? (
              <form onSubmit={(e) => handleCreateCommunity(e)}>
                <div>
                  <input
                    placeholder="📝 Digite um nome para sua comunidade"
                    value={communityTitle}
                    onChange={(e) => setCommunityTitle(e.target.value)}
                    aria-label="📝 Digite um nome para sua comunidade"
                    type="text"
                  />
                </div>
                <div>
                  <input
                    placeholder="🖼 Insira uma URL para usar como imagem de capa"
                    value={communityImage}
                    onChange={(e) => setCommunityImage(e.target.value)}
                    aria-label="🖼 Insira uma URL para usar como imagem de capa"
                    type="text"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isCreatingCommunity ? "" : true}
                >
                  {isCreatingCommunity ? "Criando..." : "Criar comunidade"}
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => handleCreateScrap(e)}>
                <div>
                  <textarea
                    placeholder="Digite seu recado aqui..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="Digite seu recado aqui"
                    type="text"
                    autoComplete="off"
                    // required
                  />
                </div>

                <button type="submit" disabled={!isCreatingScrap ? "" : true}>
                  {isCreatingScrap ? "Enviando..." : "Enviar recado"}
                </button>
              </form>
            )}
          </Box>
          {scraps.length > 0 && (
            <Box>
              <h1 className="subTitle">Recados recentes</h1>
              <ul>
                {scraps.map((scrap) => {
                  return (
                    <Scrap key={scrap.id}>
                      <a>
                        <img src={`https://github.com/${scrap.username}.png`} />
                      </a>
                      <div>
                        <span>{scrap.username}</span>
                        <p>{scrap.description}</p>
                      </div>
                    </Scrap>
                  );
                })}
              </ul>
            </Box>
          )}
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          {/* Seção de seguidores: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguidores}
          >
            <h2 className="smallTitle">Seguidores ({seguidores.length}):</h2>
            <ul>
              {seguidores.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/profile/${item.login}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.login}.png`} />
                        <span>{item.login}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {seguidores.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreSeguidores(e)}
                >
                  {isShowingMoreSeguidores ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>

          {/* Seção de comunidades: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreComunidades}
          >
            <h2 className="smallTitle">Comunidades ({comunidades.length}):</h2>

            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/comunidades/${item.id}`} passHref>
                      <a>
                        <img src={item.imageurl} />
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {comunidades.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreComunidades(e)}
                >
                  {isShowingMoreComunidades ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
          {comunidades.length < 1 && (
            <Box style={{ backgroundColor: "#fcfdde" }}>
              <div>
                <p>
                  <b>Dica:</b> Para participar de uma comunidade acesse a página
                  de comunidades clicando em "Comunidades" na parte superior da
                  página.
                </p>
              </div>
            </Box>
          )}

          {/* Seção de seguindo: */}
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreSeguindo}
          >
            <h2 className="smallTitle">Você segue ({seguindo.length}):</h2>
            <ul>
              {seguindo.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/profile/${item.login}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.login}.png`} />
                        <span>{item.login}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {seguindo.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => toggleShowMoreSeguindo(e)}
                >
                  {isShowingMoreSeguindo ? "Ver menos" : "Ver mais"}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
/*A partir daqui, parte do SSR -> Server Side Rendering 
= Não é exibe no navegador,e muitas vezes nem no console, 
apenas no terminal onde seu projeta está sendo compilado*/

/* Só deixa o usuário acessar essa página Home, SE ele
estiver autenticado, com um usuário existente do GitHub: */
export async function getServerSideProps(context) {
  /* Pega o githubUser digitado pelo usuário na 
  tela de login a partir do cookie de TOKEN: */
  const cookies = nookies.get(context);
  const userToken = cookies.USER_TOKEN;

  //Decodifica o token com a biblioteca jsonwebtoken:
  const { githubUser } = jwt.decode(userToken);
  //console.log("Token decodificado do Cookie:", token);

  /* Verifica a autorização do usuário com o hook custom, 
  a partir do Token dele (Se ele existe ou não, no GitHub): 
  */
  const isAuthenticated = await checkUserAuth(userToken);
  //Caso o usuário não esteja autenticado:
  if (!isAuthenticated) {
    return {
      //Manda ele pra página de login:
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  /* Se o usuário estiver autenticado, 
  retorna ele como prop pro componente Home: */
  return {
    props: {
      githubUser
    } // will be passed to the page component as props
  };
}
