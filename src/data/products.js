const imageModules = import.meta.glob('../img/**/*.{jpeg,jpg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

const albumCopy = {
  cozinhaImg: {
    title: 'Cozinha',
    description:
      'Album dedicado a cozinhas planejadas, com foco em armazenamento inteligente, acabamento fino e rotina pratica.',
    features: ['Marcenaria sob medida', 'Aproveitamento vertical', 'Acabamentos resistentes'],
  },
  generalImg: {
    title: 'Geral',
    description:
      'Album geral com referencias de marcenaria para diferentes ambientes e estilos de projeto.',
    features: ['Ambientes variados', 'Solucoes personalizadas', 'Base para novos projetos'],
  },
};

function slugify(value) {
  return value
    .replace(/Img$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function formatAlbumTitle(folderName) {
  if (albumCopy[folderName]?.title) {
    return albumCopy[folderName].title;
  }

  return folderName
    .replace(/Img$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const albums = Object.entries(imageModules).reduce((accumulator, [path, image]) => {
  const [, folderName, fileName] = path.match(/..\/img\/([^/]+)\/([^/]+)$/) || [];

  if (!folderName || /logo/i.test(fileName)) {
    return accumulator;
  }

  if (!accumulator[folderName]) {
    accumulator[folderName] = [];
  }

  accumulator[folderName].push(image);
  return accumulator;
}, {});

export const products = Object.entries(albums).map(([folderName, images]) => {
  const category = slugify(folderName);
  const title = formatAlbumTitle(folderName);

  return {
    id: category,
    title,
    category,
    images,
    thumbnail: images[0],
    description:
      albumCopy[folderName]?.description ||
      `Album ${title} com imagens organizadas para alimentar a galeria e futuras paginas do site.`,
    features: albumCopy[folderName]?.features || [
      'Galeria escalavel por pasta',
      'Filtro automatico por album',
      'Pronto para detalhes futuros',
    ],
  };
});
