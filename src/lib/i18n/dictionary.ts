/**
 * Diccionario de interfaz ES → RU (solo textos de la interfaz, no el contenido
 * de los artículos). La clave es el texto en español tal cual aparece en el
 * código, así <T>Texto</T> lo traduce buscando por el propio español.
 *
 * Si una cadena no está aquí, se muestra el español (degradación segura).
 */
export const RU: Record<string, string> = {
  // Chrome / navegación
  "Centro de ayuda": "Центр помощи",
  Inicio: "Главная",
  Clientes: "Клиенты",
  Empresas: "Компании",
  Temas: "Темы",
  Soluciones: "Решения",
  "Nuevas guías": "Новые руководства",
  "Resumen clientes": "Обзор для клиентов",
  "Resumen empresas": "Обзор для компаний",
  Agregar: "Добавить",
  "Agregar contenido": "Добавить материал",
  "Para el equipo Punto Pago": "Для команды Punto Pago",
  "Abrir menú de navegación": "Открыть меню навигации",
  "Tipo de usuario": "Тип пользователя",

  // Títulos de secciones (cliente)
  "Productos de crédito": "Кредитные продукты",
  "Productos débito": "Дебетовые продукты",
  "Tarjetas Mastercard": "Карты Mastercard",
  Marketplace: "Маркетплейс",
  "Remesas internacionales": "Международные переводы",
  "Recarga kioscos": "Пополнение в киосках",
  "Recarga app": "Пополнение в приложении",
  "Preguntas frecuentes": "Частые вопросы",

  // Títulos de secciones (empresa)
  "Pago en cuotas merchant": "Рассрочка для бизнеса",
  "Kioscos en local comercial": "Киоски в торговой точке",
  "Agente corresponsal": "Агент-корреспондент",
  "Servicios corporativos": "Корпоративные услуги",

  // Búsqueda
  "Buscar en el centro de ayuda…": "Поиск в центре помощи…",
  "Buscar…": "Поиск…",
  Buscar: "Поиск",
  "Buscar artículos": "Искать статьи",
  "Buscar en el centro de ayuda": "Поиск в центре помощи",

  // Tarjetas de producto
  "Ver tema": "Открыть тему",
  "Ver guía": "Открыть руководство",
  "Ver preguntas frecuentes": "Открыть частые вопросы",
  "Más información": "Подробнее",
  "artículo": "статья",
  "artículos": "статьи",

  // Hub clientes
  "Punto Pago para clientes": "Punto Pago для клиентов",
  "Elige un tema para ver las guías. Usa la búsqueda si ya sabes qué necesitas.":
    "Выберите тему, чтобы увидеть руководства. Используйте поиск, если уже знаете, что нужно.",
  "Todas las guías por tema": "Все руководства по темам",
  "Expande un tema para ver cada artículo. Los enlaces del menú lateral también llevan aquí.":
    "Разверните тему, чтобы увидеть каждую статью. Ссылки бокового меню также ведут сюда.",

  // Hub empresas
  "Punto Pago para empresas": "Punto Pago для компаний",
  "Soluciones para comercios, corresponsales y empresas. Elige una línea de negocio para ver las guías.":
    "Решения для торговцев, корреспондентов и компаний. Выберите направление, чтобы увидеть руководства.",
  "Todas las guías por solución": "Все руководства по решениям",
  "Expande una solución para ver cada artículo disponible.":
    "Разверните решение, чтобы увидеть каждую доступную статью.",

  // Sección "Nuevas guías" (hubs)
  "Guías agregadas recientemente por el equipo de Punto Pago.":
    "Руководства, недавно добавленные командой Punto Pago.",

  // Artículo: meta y secciones
  "min de lectura": "мин чтения",
  "Actualizado:": "Обновлено:",
  "En esta sección": "В этом разделе",
  "En esta guía": "В этом руководстве",
  "Contenido de la guía": "Содержание руководства",

  // Feedback
  "¿Te resultó útil esta guía?": "Было ли это руководство полезным?",
  Sí: "Да",
  No: "Нет",
  "¡Gracias por tu opinión! Nos ayuda a mejorar la guía.":
    "Спасибо за ваш отзыв! Это помогает нам улучшать руководство.",
  "Gracias por avisarnos.": "Спасибо, что сообщили.",
  "Si necesitas ayuda directa, escríbenos por":
    "Если нужна прямая помощь, напишите нам в",
  "o llama al": "или позвоните по",

  // Soporte
  "¿Necesitas más ayuda?": "Нужна дополнительная помощь?",
  "Nuestro equipo de soporte está disponible para resolver tus dudas.":
    "Наша команда поддержки готова ответить на ваши вопросы.",
  Llamar: "Позвонить",

  // Selector de idioma
  Idioma: "Язык",
  "Español": "Испанский",
  Ruso: "Русский",

  // Traducción de artículos (banner)
  "Traducción automática generada con IA. Revísala antes de confiar en ella.":
    "Автоматический перевод, сгенерированный ИИ. Проверьте его перед использованием.",
  "Este artículo aún no está traducido al ruso. Se muestra en español.":
    "Эта статья ещё не переведена на русский. Показана на испанском.",
  "Traducir con IA": "Перевести с ИИ",
  Regenerar: "Сгенерировать заново",
  "Guardar traducción": "Сохранить перевод",
  Descartar: "Отменить",
  "Traduciendo…": "Перевод…",
  "Guardando…": "Сохранение…",
  "Traducción guardada. Se publicará tras el redespliegue.":
    "Перевод сохранён. Он появится после повторного развёртывания.",
  "Mostrando borrador sin guardar.": "Показан несохранённый черновик.",
  "Traduciendo automáticamente con IA…": "Автоматический перевод с ИИ…",
  "Traducción guardada por el equipo. Puedes regenerarla si lo necesitas.":
    "Перевод сохранён командой. При необходимости можно сгенерировать заново.",
};
