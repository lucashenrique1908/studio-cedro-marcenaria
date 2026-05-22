const imageModules = import.meta.glob(
  '../assets/projects/{cozinha,Quartos,DesignsEspeciais}/*.{jpeg,jpg,png,webp,avif}',
  {
    eager: true,
    import: 'default',
  },
);

// The gallery is driven by folder names so new photos can be added without
// touching the rendering components.
const folderConfig = {
  cozinha: {
    category: 'cozinha',
    categoryLabel: 'Cozinha',
    title: 'Cozinha planejada',
    descriptions: [
      'Cozinha sob medida com marcenaria pensada para organizar utensílios e manter a rotina leve.',
      'Projeto de cozinha com armários bem distribuídos e acabamento preparado para uso diário.',
      'Composição de cozinha que valoriza circulação, bancada funcional e armazenamento acessível.',
      'Cozinha planejada com linhas limpas, boa iluminação e espaços práticos para preparo.',
      'Ambiente de cozinha com móveis ajustados ao espaço e soluções discretas de organização.',
      'Projeto para cozinha com aproveitamento vertical e visual integrado ao estilo da casa.',
      'Cozinha sob medida com nichos, portas e gavetas pensados para facilitar cada tarefa.',
      'Marcenaria de cozinha com acabamento resistente e distribuição equilibrada dos volumes.',
      'Cozinha planejada para unir área de preparo, armazenamento e visual acolhedor.',
      'Solução de cozinha com armários funcionais e detalhes que deixam o ambiente mais fluido.',
      'Projeto de cozinha com composição sob medida para valorizar o espaço disponível.',
      'Cozinha com marcenaria personalizada, foco em praticidade e acabamento harmônico.',
    ],
    features: ['Armarios sob medida', 'Uso inteligente do espaço', 'Acabamento resistente'],
  },
  Quartos: {
    category: 'quarto',
    categoryLabel: 'Quarto',
    title: 'Quarto sob medida',
    descriptions: [
      'Quarto planejado com marcenaria feita para ampliar organização sem pesar no ambiente.',
      'Projeto de quarto com volumes sob medida e acabamento pensado para uma rotina tranquila.',
      'Composição para quarto que combina armazenamento, conforto visual e uso prático.',
      'Quarto com móveis planejados para aproveitar paredes, cantos e áreas de passagem.',
      'Marcenaria de quarto com soluções discretas para guardar roupas e objetos pessoais.',
      'Ambiente de descanso com projeto sob medida e distribuição equilibrada dos armários.',
      'Quarto planejado com linhas simples, organização clara e acabamento acolhedor.',
      'Projeto de quarto que integra funcionalidade diária e uma presença visual mais leve.',
      'Solução para quarto com marcenaria personalizada e aproveitamento cuidadoso do espaço.',
    ],
    features: ['Roupeiros planejados', 'Organização diária', 'Conforto visual'],
  },
  DesignsEspeciais: {
    category: 'design-especial',
    categoryLabel: 'design especial',
    title: 'Design especial',
    descriptions: [
      'Peça especial de marcenaria com desenho personalizado para destacar o ambiente.',
      'Projeto autoral com acabamento sob medida e solução pensada para uma necessidade específica.',
      'Design especial que transforma uma área comum em um ponto funcional e marcante.',
      'Composição personalizada com detalhes de marcenaria que valorizam o uso do espaço.',
      'Solução sob medida com proporções cuidadas e presença visual diferenciada.',
      'Projeto especial com encaixes e acabamentos criados para um resultado exclusivo.',
      'Marcenaria personalizada que une utilidade, beleza e identidade no mesmo elemento.',
      'Design especial desenvolvido para resolver o espaço com elegância e praticidade.',
      'Peça sob medida com linguagem própria e acabamento integrado ao restante do ambiente.',
      'Projeto personalizado com foco em detalhes, durabilidade e uso confortável.',
      'Solução de design especial para aproveitar melhor uma área e criar destaque visual.',
      'Marcenaria com desenho exclusivo, pensada para organizar e compor o ambiente.',
      'Projeto especial com volumes bem definidos e acabamento alinhado ao estilo do espaço.',
      'Composição sob medida que cria uma função nova sem perder leveza visual.',
      'Design personalizado com detalhes precisos e leitura contemporanea.',
      'Peça planejada para combinar apoio, organização e acabamento diferenciado.',
      'Marcenaria especial com desenho limpo e solução ajustada ao dia a dia.',
      'Projeto exclusivo que valoriza materiais, proporções e funcionalidade.',
      'Design especial feito para dar identidade ao ambiente com uso inteligente do espaço.',
      'Solução personalizada com acabamento cuidadoso e presença sob medida.',
      'Projeto de marcenaria criativa para integrar função e decoração em um único ponto.',
      'Peça especial com composição equilibrada e detalhes pensados para durar.',
      'Design sob medida que destaca a marcenaria como parte central do ambiente.',
      'Projeto personalizado com foco em adaptar o movel ao estilo e a rotina do cliente.',
      'Marcenaria especial com solução prática para um espaço de uso específico.',
      'Composição exclusiva que combina armazenamento, apoio e acabamento refinado.',
      'Design especial com desenho funcional e resultado visual sob medida.',
      'Projeto de destaque com marcenaria personalizada e proporções bem resolvidas.',
      'Solução criativa para organizar melhor o ambiente e manter uma aparência sofisticada.',
      'Peça exclusiva com acabamento harmônico e detalhes alinhados ao projeto.',
      'Marcenaria de design especial pensada para aproveitar o espaço com personalidade.',
      'Projeto sob medida com presença elegante e função bem definida.',
      'Design personalizado que fecha o ambiente com praticidade e acabamento cuidadoso.',
    ],
    features: ['Desenho exclusivo', 'Solução personalizada', 'Detalhes sob medida'],
  },
};

function getFolderName(path) {
  return path.match(/\/projects\/([^/]+)\//)?.[1];
}

function getFileName(path) {
  return path.split('/').pop() || '';
}

function naturalCompare(left, right) {
  return left.fileName.localeCompare(right.fileName, 'pt', {
    numeric: true,
    sensitivity: 'base',
  });
}

const imagesByFolder = Object.entries(imageModules).reduce((accumulator, [path, src]) => {
  const folderName = getFolderName(path);

  if (!folderConfig[folderName]) {
    return accumulator;
  }

  if (!accumulator[folderName]) {
    accumulator[folderName] = [];
  }

  accumulator[folderName].push({
    src,
    fileName: getFileName(path),
  });

  return accumulator;
}, {});

export const products = Object.entries(folderConfig).flatMap(([folderName, config]) => {
  const folderImages = [...(imagesByFolder[folderName] || [])].sort(naturalCompare);

  return folderImages.map((image, index) => {
    const description =
      (config.descriptions[index] ||
      `${config.title} com marcenaria sob medida e acabamento pensado para o contexto do ambiente.`)
        .replace(/\bfoto\b/gi, '')
        .replace(/\bFoto\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.])/g, '$1')
        .trim();

    return {
      id: `${config.category}-${index + 1}`,
      title: '',
      category: config.category,
      categoryLabel: config.categoryLabel,
      images: [
        {
          src: image.src,
          alt: description,
          description,
        },
      ],
      thumbnail: image.src,
      description,
      features: [],
    };
  });
});
