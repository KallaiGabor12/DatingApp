import ProfileComponent from "@/components/admin/profile/ProfilePage";
import { jwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage(){
  return <>
    <ProfileComponent />
  </>
}