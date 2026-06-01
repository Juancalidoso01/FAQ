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

  // Inicio (home)
  "¿En qué te podemos ayudar?": "Чем мы можем помочь?",
  "Preguntas frecuentes, guías y soporte para usuarios y comercios de Punto Pago en Panamá. Pagos, recargas, tarjetas Mastercard, terminales y más.":
    "Частые вопросы, руководства и поддержка для пользователей и компаний Punto Pago в Панаме. Платежи, пополнения, карты Mastercard, терминалы и другое.",
  "Ej: activar tarjeta, recargar, remesas…": "Напр.: активировать карту, пополнить, переводы…",
  "Soy cliente": "Я клиент",
  "Tarjetas, recargas, Marketplace, remesas y soporte de la app.":
    "Карты, пополнения, Маркетплейс, переводы и поддержка приложения.",
  "Soy empresa": "Я компания",
  "Cuotas en comercio, kioscos, corresponsales y soluciones B2B.":
    "Рассрочка в магазине, киоски, корреспонденты и B2B-решения.",
  "Temas populares": "Популярные темы",
  "Accesos directos a lo que más consultan nuestros clientes.":
    "Быстрый доступ к тому, что чаще всего спрашивают клиенты.",
  "Explorar por tema": "Просмотр по темам",
  "Elige una categoría para ver todas las guías disponibles.":
    "Выберите категорию, чтобы увидеть все доступные руководства.",
  "Ver hub clientes →": "Открыть раздел для клиентов →",
  "Respuestas rápidas a dudas comunes.": "Быстрые ответы на частые вопросы.",
  "Ver todas →": "Смотреть все →",
  "Leer guía completa →": "Читать полное руководство →",
  "Teléfono": "Телефон",

  // Temas populares (enlaces)
  "Activar tarjeta": "Активировать карту",
  "Ver PIN y datos": "Посмотреть PIN и данные",
  "Recargar billetera": "Пополнить кошелёк",
  "Pago no reflejado": "Платёж не отображается",
  "Comprar en línea": "Покупки онлайн",

  // Migas de pan y categorías
  "Ruta de navegación": "Навигационная цепочка",
  "No hay artículos publicados en esta categoría por el momento.":
    "В этой категории пока нет опубликованных статей.",

  // Búsqueda (resultados)
  resultado: "результат",
  resultados: "результаты",
  para: "по запросу",
  'No encontramos artículos con ese término. Prueba con otras palabras como "recarga", "Mastercard" o "pago no reflejado".':
    "По этому запросу статьи не найдены. Попробуйте другие слова, например «пополнение», «Mastercard» или «платёж не отображается».",
  "Ingresa un término de búsqueda para comenzar.":
    "Введите поисковый запрос, чтобы начать.",

  // Descripciones de secciones (cliente)
  "Productos financieros, recargas y soporte de la app Punto Pago.":
    "Финансовые продукты, пополнения и поддержка приложения Punto Pago.",
  "Tarjeta de crédito, Dream Card, línea de crédito, adelanto de saldo, pago con cuotas y Marketplace en cuotas — guías oficiales Punto Pago.":
    "Кредитная карта, Dream Card, кредитная линия, аванс баланса, оплата в рассрочку и Маркетплейс в рассрочку — официальные руководства Punto Pago.",
  "Tarjeta prepago Mastercard y Tarjeta Junior para menores — débito prepago, no crédito.":
    "Предоплаченная карта Mastercard и карта Junior для несовершеннолетних — предоплата, не кредит.",
  "Activar, consultar PIN, comprar en línea, retirar en cajeros y más — guías que aplican a todas las tarjetas Mastercard Punto Pago.":
    "Активация, просмотр PIN, покупки онлайн, снятие в банкоматах и другое — руководства для всех карт Mastercard Punto Pago.",
  "Tienda en línea en la app: compra productos de comercios locales con entrega a domicilio y pago al contado.":
    "Онлайн-магазин в приложении: покупайте товары местных продавцов с доставкой на дом и оплатой при получении.",
  "Envía dinero desde Panamá a Colombia, Nicaragua y República Dominicana. Promo permanente: 2 remesas gratis.":
    "Отправляйте деньги из Панамы в Колумбию, Никарагуа и Доминиканскую Республику. Постоянная акция: 2 перевода бесплатно.",
  "Paga operadores y servicios en kioscos Punto Pago con efectivo. El pago se aplica al instante.":
    "Оплачивайте операторов и услуги в киосках Punto Pago наличными. Платёж зачисляется мгновенно.",
  "Recarga el saldo de tu billetera desde la app: efectivo, tarjeta, Clave, PayPal o ACH.":
    "Пополняйте баланс кошелька из приложения: наличные, карта, Clave, PayPal или ACH.",
  "Respuestas rápidas sobre la app, pagos, cuenta y problemas comunes que suelen tener los clientes.":
    "Быстрые ответы о приложении, платежах, аккаунте и частых проблемах клиентов.",

  // Descripciones de secciones (empresa)
  "Soluciones para comercios, corresponsales y empresas en Panamá.":
    "Решения для торговцев, корреспондентов и компаний в Панаме.",
  "Compra ahora y paga después en tu local: Punto Pago financia al cliente y te paga a ti. Guía completa en comercios.puntopago.net.":
    "Купи сейчас, плати потом в вашем магазине: Punto Pago финансирует клиента и платит вам. Полное руководство на comercios.puntopago.net.",
  "Instala un kiosco Punto Pago en tu comercio para recargas y pagos de servicios.":
    "Установите киоск Punto Pago в своём магазине для пополнений и оплаты услуг.",
  "Opera como corresponsal Punto Pago en tu comunidad: cobros, recargas y servicios.":
    "Работайте корреспондентом Punto Pago в своём районе: приём платежей, пополнения и услуги.",
  "Checkout, Payments Hub y soluciones de recaudo para empresas.":
    "Checkout, Payments Hub и решения для приёма платежей для компаний.",
  "Dudas comunes de comercios sobre afiliación, terminales y comisiones.":
    "Частые вопросы торговцев о подключении, терминалах и комиссиях.",

  // Herramienta del equipo: redactar
  "Herramienta del equipo": "Инструмент команды",
  "Revisar traducciones →": "Проверить переводы →",
  "Organizar el menú →": "Организовать меню →",
  "Redactar una guía con IA": "Создать руководство с ИИ",
  "Pega aquí lo que sabes (una pregunta frecuente, una respuesta que das por teléfono o tus notas) y la IA lo convierte en una guía ordenada y la ubica en el tema correcto. Revisa el resultado antes de publicar.":
    "Вставьте сюда то, что знаете (частый вопрос, ответ, который вы даёте по телефону, или свои заметки), и ИИ превратит это в понятное руководство и поместит в нужную тему. Проверьте результат перед публикацией.",
  "Escribe la información": "Введите информацию",
  "Revisa el borrador": "Проверьте черновик",
  Publica: "Опубликуйте",
  "Clave de acceso del equipo": "Пароль доступа команды",
  Entrar: "Войти",
  "¡Guía publicada!": "Руководство опубликовано!",
  "Tu guía ya está disponible en línea. Puedes abrirla.":
    "Ваше руководство уже доступно онлайн. Можно открыть.",
  "Estamos publicando tu guía. Tarda 1–2 minutos en aparecer; te avisamos aquí cuando esté lista. No cierres esta página.":
    "Мы публикуем ваше руководство. Это занимает 1–2 минуты; мы сообщим здесь, когда оно будет готово. Не закрывайте эту страницу.",
  "Ver la guía": "Открыть руководство",
  "Preparando la guía…": "Подготовка руководства…",
  "Redactar otra": "Создать ещё одно",
  "Idioma del contenido": "Язык материала",
  "Escribe en ruso. Al publicar se generará también la versión en español automáticamente.":
    "Пишите на русском. При публикации автоматически создастся и версия на испанском.",
  "Escribe en español. Los consultores podrán verla en ruso (traducción automática).":
    "Пишите на испанском. Консультанты смогут видеть это на русском (автоматический перевод).",
  "Información a convertir en guía": "Информация для преобразования в руководство",
  "Ej: Cuando el cliente pregunta cómo recuperar su PIN, debe entrar a la app, ir a Tarjetas, seleccionar la tarjeta y tocar 'Ver PIN'. Necesita tener la app actualizada...":
    "Напр.: Когда клиент спрашивает, как восстановить PIN, нужно зайти в приложение, открыть «Карты», выбрать карту и нажать «Посмотреть PIN». Приложение должно быть обновлено...",
  "Estructurando con IA…": "Структурирование с ИИ…",
  "Estructurar con IA": "Структурировать с ИИ",
  "Revisar y editar": "Проверить и отредактировать",
  "Posible duplicado:": "Возможный дубликат:",
  "Revisa si ya existe una guía similar.": "Проверьте, нет ли уже похожего руководства.",
  "Guías parecidas": "Похожие руководства",
  "Si tu guía cubre lo mismo, considera editar la existente en vez de crear una nueva.":
    "Если ваше руководство охватывает то же самое, лучше отредактируйте существующее, а не создавайте новое.",
  "Título": "Заголовок",
  Resumen: "Краткое описание",
  "Tema / categoría": "Тема / категория",
  "➕ Crear tema nuevo…": "➕ Создать новую тему…",
  "Nombre del tema nuevo": "Название новой темы",
  "Ej: Pagos con QR": "Напр.: Оплата по QR",
  "Contenido (markdown)": "Содержание (markdown)",
  "Publicando…": "Публикация…",
  "Publicar guía": "Опубликовать руководство",
  "Empezar de nuevo": "Начать заново",
  "Vista previa": "Предпросмотр",
  General: "Общее",

  // Herramienta del equipo: revisar traducciones
  "Revisar traducciones": "Проверить переводы",
  "Ingresa la clave del equipo para continuar.": "Введите пароль команды, чтобы продолжить.",
  "Clave de acceso": "Пароль доступа",
  "Elige una guía, genera la traducción con IA y corrige el texto antes de guardar. Cada guía se traduce al idioma contrario al que se redactó.":
    "Выберите руководство, создайте перевод с помощью ИИ и отредактируйте текст перед сохранением. Каждое руководство переводится на язык, противоположный тому, на котором оно было написано.",
  "Traduciendo todo…": "Переводим всё…",
  "Traducir todo lo que falta": "Перевести всё недостающее",
  "← Volver": "← Назад",
  "Traduciendo todas las guías pendientes…": "Переводим все ожидающие руководства…",
  de: "из",
  "No cierres esta página. Puede tardar varios minutos según la cantidad de guías.":
    "Не закрывайте эту страницу. Это может занять несколько минут в зависимости от количества руководств.",
  "Listo: se tradujeron": "Готово: переведено",
  "guías.": "руководств.",
  "no se pudieron traducir; puedes reintentar.": "не удалось перевести; можно повторить попытку.",
  "Los cambios se publican tras el redespliegue de Vercel (~1 min).":
    "Изменения публикуются после повторного развёртывания Vercel (~1 мин).",
  "Buscar guía…": "Поиск руководства…",
  "Redactada en ruso": "Написано на русском",
  Traducida: "Переведено",
  "Sin resultados.": "Нет результатов.",
  "Elige una guía de la lista para empezar.": "Выберите руководство из списка, чтобы начать.",
  "Cargando…": "Загрузка…",
  "Traducción guardada. Se publicará tras el redespliegue de Vercel (~1 min).":
    "Перевод сохранён. Он будет опубликован после повторного развёртывания Vercel (~1 мин).",
  original: "оригинал",
  editable: "редактируемый",
  Descripción: "Описание",

  // Herramienta del equipo: organizar el menú
  "Organizar el menú": "Организовать меню",
  "Arrastra las guías entre secciones para decidir dónde aparece cada una. Las guías nuevas comienzan en «Sin ubicar».":
    "Перетаскивайте руководства между разделами, чтобы решить, где появится каждое. Новые руководства начинают в разделе «Без размещения».",
  "← Volver a redactar": "← Назад к созданию",
  "Sin ubicar (nuevas)": "Без размещения (новые)",
  "Suelta guías aquí": "Перетащите руководства сюда",
  "¿Restaurar el orden original y borrar todas las ubicaciones manuales?":
    "Восстановить исходный порядок и удалить все ручные размещения?",
  "Restaurar orden original": "Восстановить исходный порядок",
  "Guardar orden": "Сохранить порядок",
  "Sin cambios": "Без изменений",
  "Orden restaurado. Vercel desplegará los cambios en ~1 minuto.":
    "Порядок восстановлен. Vercel развернёт изменения через ~1 минуту.",
  "Orden guardado. Vercel desplegará los cambios en ~1 minuto.":
    "Порядок сохранён. Vercel развернёт изменения через ~1 минуту.",
  "Error desconocido.": "Неизвестная ошибка.",

  // Libro digital / exportar
  "Guía completa": "Полное руководство",
  Índice: "Содержание",
  "← Volver al inicio": "← На главную",
  "Descargar HTML": "Скачать HTML",
  "Imprimir / Guardar PDF": "Печать / Сохранить PDF",
  guías: "руководств",
  "Las guías sin traducción se muestran en español.":
    "Руководства без перевода показаны на испанском.",
  "Descargar libro": "Скачать книгу",
  "Exportar libro →": "Экспортировать книгу →",
  "Descargar guía completa": "Скачать полное руководство",
  "(libro digital en PDF o HTML)": "(цифровая книга в PDF или HTML)",
  "Exportar guía (PDF)": "Экспортировать руководство (PDF)",

  // Subgrupos (empresa)
  "Introducción": "Введение",
  Comenzando: "Начало работы",
  "Registro y contrato": "Регистрация и договор",
  "Qué hace el cliente": "Что делает клиент",
  "Acceso empleados": "Доступ для сотрудников",
  "Comisiones y pagos": "Комиссии и выплаты",
  "Devoluciones y disputas": "Возвраты и споры",
  "Afiliación": "Подключение",
  "Soporte técnico": "Техническая поддержка",
  Registro: "Регистрация",
  "Afiliación y registro": "Подключение и регистрация",
  "Terminales y comisiones": "Терминалы и комиссии",
};
