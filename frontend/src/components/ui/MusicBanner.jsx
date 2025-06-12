// eslint-disable-next-line react/prop-types
const MusicBanner = ({ type = 'generos' }) => {
  // Mapeo de tipos a nombres de archivo reales
  const imageMap = {
    generos: {
      desktop: '/Header_generos_dsk@2x-100.jpg',
      mobile: '/Header_generos_mobile@2x-100.jpg'
    },
    moods: {
      desktop: '/Header_moods_dsk@2x-100.jpg',
      mobile: '/Header_moods_mobile@2x-100.jpg'
    },
    trending: {
      desktop: '/Header_tranding_dsk@2x-100.jpg',
      mobile: '/Header_trending_mobile@2x-100.jpg'
    },
    shows: {
      desktop: '/Header_shows_dsk@2x-100.jpg',
      mobile: '/Header_shows_mobile@2x-100.jpg'
    },
    premios: {
      desktop: '/Header_premios_dsk@2x-100.jpg',
      mobile: '/Header_premios_mobile@2x-100.jpg'
    }
  };

  // Obtener las imágenes correspondientes al tipo
  const images = imageMap[type] || imageMap.generos;

  return (
    <div className="px-6 pb-5 md:pb-10">
      {/* Imagen para escritorio - visible solo en md y superiores */}
      <img 
        src={images.desktop} 
        alt={`Banner ${type} desktop`}
        className="hidden md:block w-full h-auto object-cover rounded-[10px]"
      />
      
      {/* Imagen para móvil - visible solo en pantallas pequeñas */}
      <img 
        src={images.mobile} 
        alt={`Banner ${type} mobile`}
        className="block md:hidden w-full h-auto object-cover rounded-[10px]"
      />
    </div>
  );
};

export default MusicBanner;