import chatbotBanner from '../assets/images/chatbot-banner.jpg';
import founderChatbot from '../assets/images/hari-founder-chatbot.jpg';
import founder from '../assets/images/hari-founder.jpg';
import logo from '../assets/images/logo.jpg';

const localProjectImages = {
  '/assets/images/chatbot-banner.jpg': chatbotBanner,
  '/assets/images/hari-founder-chatbot.jpg': founderChatbot,
  '/assets/images/hari-founder.jpg': founder,
  '/assets/images/logo.jpg': logo
};

export function resolveProjectImage(image) {
  if (!image) return '';
  return localProjectImages[image] || image;
}
