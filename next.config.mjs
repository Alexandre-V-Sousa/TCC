/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera site estático
  output: 'export',

  // Desativa otimização de imagens do Next.js
  images: {
    unoptimized: true,
  },

  // Configura basePath se o repositório não for usuário/username.github.io
  // Se o seu repositório for "username.github.io", pode remover essa linha
  // basePath: '/agropecuaria-site',
}

export default nextConfig;
