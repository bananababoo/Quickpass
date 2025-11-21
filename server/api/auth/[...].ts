import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'; // Import as a default export

const runtimeConfig = useRuntimeConfig();


export default NuxtAuthHandler({
    secret: runtimeConfig.authSecret,
    providers: [
        GoogleProvider.default({
            clientId: runtimeConfig.public.googleClientId,
            clientSecret: runtimeConfig.googleClientSecret,
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {    
            if (account) {
                token.id_token = profile?.sub
                
                console.log("ID TOKEN: " + token.id_token);
            }
        return token;
        },
        async session({ session, token, }) {
            return {
                ...session,
                id_token: token.id_token,
            }
        },
    }

})