import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Tailwind,
  Button,
  Link,
} from "@react-email/components";
import emailTailwindConfig from "./tailwind.config";

export function PasswordChangedEmail({userid}:{userid:number}) {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
  return (
    <Html>
      <Head />
      <Tailwind config={emailTailwindConfig}>
        <Body className="bg-gray-100 w-full">
          <Container className="bg-white p-8 rounded-lg shadow w-8/12 mx-auto py-12 px-20 max-w-2xl">
            <Text className="text-2xl text-center font-bold">Cool-Finish Kft.</Text>
            <br />
            <Text className="text-center text-desktop-p!">A jelszava megváltozott.</Text>
            <Text className="text-center text-desktop-p! px-10">Ha ez nem az Ön vagy egy Ön által meghatalmazott tevékenysége volt, azonnal vegye fel a kapcsolatot a rendszergazdával és továbbítsa a következő információt: <br /> id={userid}</Text>
            <Text className="text-center text-default">{formatted}</Text>
            <br />
            <Text className="text-center text-default">Erre a címre ne küldjön válasz emailt, mivel nem fogad leveleket.</Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}


export function RestorePasswordEmail({link}:{link:string}) {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
  return (
    <Html>
      <Head />
      <Tailwind config={emailTailwindConfig}>
        <Body className="bg-gray-100 w-full">
          <Container className="bg-white p-8 rounded-lg shadow w-8/12 mx-auto py-12 px-20 max-w-2xl">
            <Text className="text-2xl text-center font-bold">Cool-Finish Kft.</Text>
            <br />
            <Text className="text-center text-desktop-p!">A jelszó megváltoztatásához kattintson ide:</Text>
            <Container className="w-max mx-auto">
              <Link className="bg-main rounded-md px-8 font-bold uppercase text-white! py-5 mx-auto text-center w-max" href={link}>Jelszó megváltoztatása</Link>
            </Container>
            <Text className="text-center text-desktop-p!">Ha gomb nem működik, másolja be a keresőjébe a következőt:</Text>
            <Text className="text-center text-desktop-p!">{link}</Text>
            <Text className="text-center text-desktop-p! px-10">Ha ez nem az Ön tevékenysége, hagyja figyelmen kívül.</Text>
            <Text className="text-center text-default">{formatted}</Text>
            <br />
            <Text className="text-center text-default">Erre a címre ne küldjön válasz emailt, mivel nem fogad leveleket.</Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}