"use strict";

let ObjectID = require('mongodb').ObjectID;
let path = require('path');
let rootPath = path.resolve(__dirname);

/**************************** Host ****************************/
let host = {};

host.domain = 'healight.green';
// host.shop = "https://shop.healight.green";

exports.host = host;
/**************************** Web Site ****************************/
let site = {};

site.mail = "m.gh@linuxmail.org";
site.favicon = '/favicon.png';
site.logo = '/site/logo.png';
site.title = "هیلایت . دانشنامه ی طب سنتی و طبیعی";
site.des = "هیلایت، دانشنامه ی طبی و علمی";
site.enc = {};
site.enc.des = "همه ی دانشنامه ها . هیلایت";

site.langs = {};
site.langs.default = 'fa';

site.langs.fa = {};
site.langs.fa.name = 'فارسی';
site.langs.en = {};
site.langs.en.name = 'English';
site.langs.inArray = [];

Object.keys(site.langs).forEach(element => {	
	if(typeof site.langs[element].name != 'undefined')
	{
		site.langs.inArray = site.langs.inArray.concat(element);
	}
});

site.CoToLang = {};
site.CoToLang.GE = 'ge';
site.CoToLang.IR = 'fa';
site.CoToLang.RU = 'ru';


/**************************** Liceses ****************************/
site.googleVerificationCode = '' // copy from google site
// Google Verification with file: Copy file to space/stuff
site.googleCustomSearchCode = "014905907737244048123:wygtedipymi"; // copy from google site
// Set Look And feel Config to Result only.
site.fontIranLicense = 'UTPBR';
site.disqusSrc = "https://healight.disqus.com/embed.js"; //for single language enlgish encyclopedia

exports.site = site;
/**************************** Database Config****************************/
let database = {};

database.enc = {};

database.enc.medicine = {};
database.enc.medicine.rootObjId = new ObjectID ("587e4bc26e4949483846ec50");
database.enc.medicine.CollName = "encyclopedia_medicine";
database.enc.medicine.name = "medicine";
database.enc.medicine.title = "nature medicine";
database.enc.medicine.FALogo = "fab fa-pagelines";

database.enc.fruits = {};
database.enc.fruits.rootObjId = new ObjectID ("287e4bc11e4949483846ec50");
database.enc.fruits.CollName = "encyclopedia_fruits";
database.enc.fruits.name = "fruits";
database.enc.fruits.title = "fruits";
database.enc.fruits.FALogo = "fab fa-apple";

database.enc.plants = {};
database.enc.plants.rootObjId = new ObjectID ("377e4bc11e4949383846ec50");
database.enc.plants.CollName = "encyclopedia_plants";
database.enc.plants.name = "plants";
database.enc.plants.title = "plants";
database.enc.plants.FALogo = "fa fa-leaf";

database.enc.drinks = {};
database.enc.drinks.rootObjId = new ObjectID ("987e4bc11e4949383846ec50");
database.enc.drinks.CollName = "encyclopedia_drinks";
database.enc.drinks.name = "drinks";
database.enc.drinks.title = "drinks";
database.enc.drinks.FALogo = "fas fa-wine-glass-alt";

database.enc.edibles = {};
database.enc.edibles.rootObjId = new ObjectID ("757e4bc11e4949383833ec50");
database.enc.edibles.CollName = "encyclopedia_edibles";
database.enc.edibles.name = "edibles";
database.enc.edibles.title = "edibles";
database.enc.edibles.FALogo = "fab fa-apple";

database.enc.sickness = {};
database.enc.sickness.rootObjId = new ObjectID ("397e4bc11e4966383833ec50");
database.enc.sickness.CollName = "encyclopedia_sickness";
database.enc.sickness.name = "sickness";
database.enc.sickness.title = "sickness";
database.enc.sickness.FALogo = "fas fa-temperature-high";

database.enc.lifestyle = {};
database.enc.lifestyle.rootObjId = new ObjectID ("067e4bc11e4966383833ec50");
database.enc.lifestyle.CollName = "encyclopedia_lifestyle";
database.enc.lifestyle.name = "lifestyle";
database.enc.lifestyle.title = "lifestyle";
database.enc.lifestyle.FALogo = "fa fa-heart";

database.enc.genetic = {};
database.enc.genetic.rootObjId = new ObjectID ("397e4bc11e4956383833ec50");
database.enc.genetic.CollName = "encyclopedia_genetic";
database.enc.genetic.name = "genetic";
database.enc.genetic.title = "genetic";
database.enc.genetic.FALogo = "fa fa-child";

database.enc.other = {};
database.enc.other.rootObjId = new ObjectID ("397e4bc11e5051383873ec50");
database.enc.other.CollName = "encyclopedia_other";
database.enc.other.name = "other";
database.enc.other.title = "other";
database.enc.other.FALogo = "fab fa-superpowers";

database.draft = {};
database.draft.CollName = 'draft';
database.site = {};
database.site.CollName = 'site';
database.social_media = {};
database.social_media.CollName = 'social_media';
database.users = {};
database.users.CollName = 'users';

database.enc.EncsColls = [];
Object.keys(database.enc).forEach(element => {	
	if(typeof database.enc[element].CollName != 'undefined')
	{
		database.enc.EncsColls = database.enc.EncsColls.concat(database.enc[element].CollName);
	}
});

database.enc.allEncsColls = database.enc.EncsColls.concat(database.draft.CollName);
database.allColls = database.enc.allEncsColls.concat(database.site.CollName, database.social_media.CollName, database.users.CollName);

exports.database = database;
/**************************** links / Server JS ****************************/
let links = {};

links.sign_out = "/sign/sign_out";
links.lanPopShow = "/stuff/lanPopShow";
links.telegram = {};
links.telegram.fa = "https://t.me/healightFa";
links.medium = {};
links.medium.fa = "https://medium.com/healightfa";

exports.links = links;
/**************************** Pages / Server JS ****************************/
let pages = {};

pages.home = "/home";
pages.license = "/license";
pages.searchRes = "/searchRes";
pages.signIn = "/signIn/#mainPart";
pages.signUp = "/signUp/#mainPart";
pages.myaccount = {};
pages.myaccount.overview = "/myaccount/overview";
pages.myaccount.profile = "/myaccount/profile";
pages.portals = {};
pages.encyclopedia = {};
Object.keys(database.enc).forEach(element => {	
	if(typeof database.enc[element].CollName != 'undefined')
	{
		pages.portals[element] = "/portals/" + database.enc[element].name;
		pages.encyclopedia[element] = "/encyclopedia/" + database.enc[element].name;
	}
});
pages.panel = {};
pages.panel.home = "/panel/home";
pages.panel.EncTree = "/panel/EncTree";
pages.panel.encyclopedia = {};
pages.panel.encyclopedia.home = "/panel/encyclopedia";
pages.panel.encyclopedia.createArt = pages.panel.encyclopedia.home + '/createArt';
pages.panel.encyclopedia.placeArt = pages.panel.encyclopedia.home + '/placeArt';
pages.panel.encyclopedia.editArt = pages.panel.encyclopedia.home + '/editArt';
pages.panel.encyclopedia.deleteArt = pages.panel.encyclopedia.home + '/deleteArt';
pages.panel.encyclopedia.approveArt = pages.panel.encyclopedia.home + '/approveArt';
pages.panel.encyclopedia.resources = pages.panel.encyclopedia.home + '/resources';
pages.panel.encyclopedia.products = pages.panel.encyclopedia.home + '/products';
pages.panel.encyclopedia.delResource = pages.panel.encyclopedia.home + '/delResource';
pages.panel.encyclopedia.nodeInf = pages.panel.encyclopedia.home + '/nodeInf';
pages.panel.encyclopedia.nodeUrl = pages.panel.encyclopedia.home + '/nodeUrl';
pages.panel.encyclopedia.uploadFile = pages.panel.encyclopedia.home + '/uploadFile';
pages.panel.encyclopedia.ArtApproves = pages.panel.encyclopedia.home + '/ArtApproves';
pages.panel.encyclopedia.ArtResources = pages.panel.encyclopedia.home + '/ArtResources';
pages.panel.encyclopedia.URLNameValidation = pages.panel.encyclopedia.home + '/URLNameValidation';
pages.panel.pagesStuff = {};
pages.panel.pagesStuff.home = "/panel/pagesStuff";
pages.panel.pagesStuff.mainPage = pages.panel.pagesStuff.home + "/mainPage";
pages.panel.pagesStuff.slideShow = pages.panel.pagesStuff.home + "/slideShow";
pages.panel.translate = {};
pages.panel.translate.home = "/panel/translate";
pages.panel.translate.text = pages.panel.translate.home + "/text";
pages.panel.translate.art = pages.panel.translate.home + "/art";
pages.panel.adminStuff = {};
pages.panel.adminStuff.home = "/panel/adminStuff";
pages.panel.adminStuff.addResources = pages.panel.adminStuff.home + "/addResources";
pages.panel.adminStuff.editResources = pages.panel.adminStuff.home + "/editResources";
pages.panel.adminStuff.resApproveArt = pages.panel.adminStuff.home + "/resApproveArt";
pages.panel.adminStuff.resTrusUsers = pages.panel.adminStuff.home + "/resTrusUsers";
pages.panel.adminStuff.resInf = pages.panel.adminStuff.home + "/resInf";
pages.panel.adminStuff.leg = pages.panel.adminStuff.home + "/leg";
pages.panel.adminStuff.nonArtTel = pages.panel.adminStuff.home + "/nonArtTel";
pages.panel.adminStuff.perm = pages.panel.adminStuff.home + "/perm";
pages.helper = {};
pages.helper.userRegion = '/helper/user_region';
pages.online_services = {};
pages.online_services.home = "/online_services/home";
pages.online_services.temperament = '/online_services/temperament';
pages.notTranslated = '/stuff/notTranslated';
pages.notTranslatedHtml = rootPath + '/site/stuff/notTranslated.html';

exports.pages = pages;
/**************************** Web Api ****************************/
let webApi = {};
webApi.home = '/web_services';

webApi.getSlideShow = webApi.home + '/getSlideShow';
webApi.setSlideShow = webApi.home + '/setSlideShow';
webApi.getLocalTrans = webApi.home + '/getLocalTrans';
pages.panel.adminStuff.nonArtsTelList_WA = pages.panel.adminStuff.home + "/WS/nonArtsTelList_WA";
pages.panel.adminStuff.nonArtTelAdd_WA = pages.panel.adminStuff.home + "/WS/nonArtTelAdd_WA";
pages.panel.adminStuff.nonArtTelDel_WA = pages.panel.adminStuff.home + "/WS/nonArtTelDel_WA";
pages.panel.adminStuff.permList_WA = pages.panel.adminStuff.home + "/WS/permList_WA";
pages.panel.adminStuff.delUser_WA = pages.panel.adminStuff.home + "/WS/delUser_WA";
pages.panel.adminStuff.addEditResources = pages.panel.adminStuff.home + "/WS/addEditResources";
pages.panel.adminStuff.delResources = pages.panel.adminStuff.home + "/WS/delResources";
pages.myaccount.editProfile_ws = "/myaccount/ws/editProfile_ws";

exports.webApi = webApi;
/**************************** Layouts ****************************/
let layouts = {};

layouts.head = rootPath + '/site/layouts/head.ejs';
layouts.header = rootPath + '/site/layouts/header.ejs';
layouts.navbar = rootPath + '/site/layouts/navbar.ejs';
layouts.sidebar_navbar = rootPath + '/site/layouts/sidebar_navbar.ejs';
layouts.footer = rootPath + '/site/layouts/footer.ejs';
layouts.scripts = rootPath + '/site/layouts/scripts.ejs';
layouts.script = rootPath + '/site/layouts/script.ejs';
layouts.panel = {};
layouts.panel.navbar = rootPath + '/site/layouts/pages/panel/navbar.ejs';
layouts.panel.sidebar = rootPath + '/site/layouts/pages/panel/sidebar.ejs';
layouts.panel.CEArtFrom = rootPath + '/site/layouts/pages/panel/CreEditArtForm.ejs';
layouts.panel.addEditResForm = rootPath + '/site/layouts/pages/panel/addEditResForm.ejs';
layouts.panel.placeArtForm = rootPath + '/site/layouts/pages/panel/placeArtForm.ejs';
layouts.panel.chooseNodeTree = rootPath + '/site/layouts/pages/panel/chooseNodeTree.ejs';
layouts.panel.slideShowForm = rootPath + '/site/layouts/pages/panel/slideShowForm.ejs';
layouts.enc = {};
layouts.enc.sidebar = rootPath + '/site/layouts/pages/encyclopedia/sidebar.ejs';
layouts.enc.mobile_sidebar = rootPath + '/site/layouts/pages/encyclopedia/mobile_sidebar.ejs';
layouts.os = {};
layouts.os.temperament = {};
layouts.os.temperament.sidebar = rootPath + '/site/layouts/pages/online_services/temperament/sidebar.ejs';
layouts.myaccount = {};
layouts.myaccount.sidebar = rootPath + '/site/layouts/pages/myaccout/sidebar.ejs';
layouts.myaccount.navbar = rootPath + '/site/layouts/pages/myaccout/navbar.ejs';
layouts.myaccount.footer = rootPath + '/site/layouts/pages/myaccout/footer.ejs';
layouts.article = rootPath + '/site/layouts/elements/article.ejs';
layouts.collapsibleQuestion = rootPath + '/site/layouts/elements/collapsibleQuestion.ejs';
layouts.approveRate = rootPath + '/site/layouts/elements/approveRate.ejs';
layouts.sharing = rootPath + '/site/layouts/elements/sharing.ejs';
layouts.comments = rootPath + '/site/layouts/elements/comments.ejs';
layouts.resources = rootPath + '/site/layouts/elements/resources.ejs';
layouts.artTags = rootPath + '/site/layouts/elements/artTags.ejs';
layouts.artLicense = rootPath + '/site/layouts/elements/artLicense.ejs';
layouts.allResources = rootPath + '/site/layouts/elements/allResources.ejs';
layouts.locationbar = rootPath + '/site/layouts/elements/location_bar.ejs';
layouts.questionMark = rootPath + '/site/layouts/elements/questionMark.ejs';
layouts.telegram = rootPath + '/site/layouts/elements/telegram.ejs';
layouts.temperament = rootPath + '/site/layouts/elements/temperament.ejs';
layouts.enterEnc = rootPath + '/site/layouts/elements/enterEnc.ejs';
layouts.nodeJsObToClientJsOb = rootPath + '/site/layouts/helper/nodeJsObToClientJsOb.ejs';
layouts.ad = rootPath + "/site/layouts/elements/ad.ejs";
layouts.mmodal = rootPath + '/site/layouts/modules/mmodal/mmodal.ejs';
layouts.slideshow = rootPath + '/site/layouts/modules/slideshow/slideshow.ejs';

exports.layouts = layouts;
/**************************** Client CSS ****************************/
let css = {};

css.main = '/stylesheet/css/main/theme.css';
css.material_dashboard = '/framework/material-dashboard-v2.0.0/assets/css/material-dashboard.css';
css.beautifier = '/stylesheet/css/main/beautifier.css';
css.bootstrap = '/framework/bootstrap-4.0.0-beta-dist/css/bootstrap.min.css';
css.circliful = '/framework/jquery-circliful/jquery.circliful.css';
css.font = '/stylesheet/css/main/font.css';
css.fontAwesome = '/framework/fontawesome/css/all.min.css';
css.animate = '/framework/animateCss/animate.min.css';
css.customBS = '/stylesheet/css/main/customBS.css';
css.fa = '/stylesheet/css/main/fa.css';
css.en = '/stylesheet/css/main/en.css';
css.os = {};
css.os.home = '/stylesheet/css/pages/online_services/home.css';
css.os.temperament = '/stylesheet/css/pages/online_services/temperament.css';
css.enc = {};
css.enc.main = '/stylesheet/css/pages/encyclopedia/theme.css';
css.enc.sidebar = '/stylesheet/css/pages/encyclopedia/sidebar.css';
css.panel = {};
css.panel.main = '/stylesheet/css/pages/panel/theme.css';
css.panel.sidebar = '/stylesheet/css/pages/panel/sidebar.css';
css.panel.EncTree = '/stylesheet/css/pages/panel/EncTree.css';
css.sign = '/stylesheet/css/pages/sign.css';
css.tinymce = '/stylesheet/css/elements/tinymce.css';
css.resources = '/stylesheet/css/elements/resources.css';
css.tagInput = '/framework/jQuery-Tags-Input/dist/jquery.tagsinput.min.css';
css.tagInputCustom = '/stylesheet/css/elements/tagInput.css';
css.slideshow = '/modules/slideshow/slideshow.css';
css.tag = '/stylesheet/css/elements/tag.css';
css.toggleBotton = '/stylesheet/css/elements/toggleBotton.css';
css.article = '/stylesheet/css/elements/article.css';
css.approveRate = '/stylesheet/css/elements/approveRate.css';
css.artTags = '/stylesheet/css/elements/artTags.css';
css.mmodal = '/modules/mmodal/mmodal.css';
css.boxes = '/stylesheet/css/elements/boxes.css';
css.questionmark = '/stylesheet/css/elements/questionMark.css';
css.gcs = '/stylesheet/css/elements/google_custom_search.css';
css.things = '/stylesheet/css/main/things.css';

exports.css = css;
/**************************** Client JS ****************************/
let js = {};

js.main = '/js/JS/main/main.js';
js.sign = '/js/JS/pages/sign.js';
js.os = {};
js.os.temperament = '/js/JS/pages/online_services/temperament.js';
js.encyclopedia = {};
js.encyclopedia.sidebar = '/js/JS/pages/encyclopedia/sidebar.js';
js.myaccount = {};
js.myaccount.profile = '/js/JS/pages/myaccount/profile.js';
js.panel = {};
js.panel.main = '/js/JS/pages/panel/panel.js';
js.panel.sidebar = '/js/JS/pages/panel/sidebar.js';
js.panel.EncTree = '/js/JS/pages/panel/EncTree.js';
js.panel.chooseNodeTree = '/js/JS/pages/panel/chooseNodeTree.js';
js.panel.encyclopedia = {};
js.panel.encyclopedia.main = '/js/JS/pages/panel/encyclopedia/main.js';
js.panel.encyclopedia.editArt = '/js/JS/pages/panel/encyclopedia/editArt.js';
js.panel.encyclopedia.createArt = '/js/JS/pages/panel/encyclopedia/createArt.js';
js.panel.encyclopedia.placeArt = '/js/JS/pages/panel/encyclopedia/placeArt.js';
js.panel.encyclopedia.approveArt = '/js/JS/pages/panel/encyclopedia/approveArt.js';
js.panel.encyclopedia.resources = '/js/JS/pages/panel/encyclopedia/resources.js';
js.panel.encyclopedia.CreEditArtForm = '/js/JS/pages/panel/encyclopedia/CreEditArtForm.js';
js.panel.pagesStuff = {};
js.panel.pagesStuff.main = '/js/JS/pages/panel/pagesStuff/main.js';
js.panel.pagesStuff.mainPage = '/js/JS/pages/panel/pagesStuff/mainPage.js';
js.panel.pagesStuff.slideShow = '/js/JS/pages/panel/pagesStuff/slideShow.js';
js.panel.pagesStuff.slideShowFrom = '/js/JS/pages/panel/pagesStuff/slideShowFrom.js';
js.panel.adminStuff = {};
js.panel.adminStuff.main = '/js/JS/pages/panel/adminStuff/main.js';
js.panel.adminStuff.addEditResForm = '/js/JS/pages/panel/adminStuff/addEditResForm.js';
js.panel.adminStuff.addResources = '/js/JS/pages/panel/adminStuff/addResources.js';
js.panel.adminStuff.editResources = '/js/JS/pages/panel/adminStuff/editResources.js';
js.panel.adminStuff.resApproveArt = '/js/JS/pages/panel/adminStuff/resApproveArt.js';
js.panel.adminStuff.resTrusUsers = '/js/JS/pages/panel/adminStuff/resTrusUsers.js';
js.panel.adminStuff.leg = '/js/JS/pages/panel/adminStuff/leg.js';
js.panel.adminStuff.nonArtTel = '/js/JS/pages/panel/adminStuff/nonArtTel.js';
js.panel.adminStuff.perm = '/js/JS/pages/panel/adminStuff/perm.js';
js.panel.translate = {};
js.panel.translate.text = '/js/JS/pages/panel/transalte/text.js';
js.material_dashboard = {};
js.material_dashboard.bootstrap = '/framework/material-dashboard-v2.0.0/assets/js/bootstrap-material-design.min.js';
js.material_dashboard.main = '/framework/material-dashboard-v2.0.0/assets/js/material-dashboard.js';
js.material_dashboard.arrive = '/framework/material-dashboard-v2.0.0/assets/js/plugins/arrive.min.js';
js.material_dashboard.bootstrapNotify = '/framework/material-dashboard-v2.0.0/assets/js/plugins/bootstrap-notify.js';
js.material_dashboard.chartist = '/framework/material-dashboard-v2.0.0/assets/js/plugins/chartist.min.js';
js.material_dashboard.perfectScrollbarJquery = '/framework/material-dashboard-v2.0.0/assets/js/plugins/perfect-scrollbar.jquery.min.js';
js.material_dashboard.demo = '/framework/material-dashboard-v2.0.0/assets/js/plugins/demo.js';
js.jquery = '/framework/jquery-3.1.1.min.js';
js.bootstrap = '/framework/bootstrap-4.0.0-beta-dist/js/bootstrap.min.js';
js.popper = '/framework/popper/popper.min.js';
js.hammer = '/framework/hammer.min.js';
js.jshashes = '/framework/hashes.min.js';
js.tinymce = '/framework/tinymce/js/tinymce/tinymce.min.js';
js.tinymceJquery = '/framework/tinymce/js/tinymce/jquery.tinymce.min.js';
js.piwik = '/framework/piwik/piwik.js';
js.chartjs = '/framework/chartjs/Chart.bundle.min.js';
js.framework = {};
js.framework.circliful = '/framework/jquery-circliful/jquery.circliful.js';
js.framework.disqus = '/framework/disqus/disqus.js';
js.tinymceInit = '/js/JS/elements/tinymceInit.js';
js.tagInput = '/framework/jQuery-Tags-Input/dist/jquery.tagsinput.min.js';
js.tagInputCustom = '/js/JS/elements/tagInput.js';
js.timeAgo = '/framework/jquery-timeago-master/jquery.timeago.js';
js.timeAgoFa = '/framework/jquery-timeago-master/locale/jquery.timeago.fa.js';
js.slideshow = '/modules/slideshow/slideshow.js';
js.search = '/js/JS/elements/search.js';
js.mmodal = '/modules/mmodal/mmodal.js';
js.langPop = '/js/JS/elements/langPop.js';
js.popover = '/js/JS/elements/popover.js';

exports.js = js;
/**************************** Methods ****************************/
let methods = {};

methods.db = {};
methods.db.main = rootPath + '/methods/DBMain.js';
methods.db.profile = rootPath + '/methods/DBProfile.js';
methods.db.articles = rootPath + '/methods/DBArticles.js';
methods.db.relatedP = rootPath + '/methods/DBRelatedP.js';
methods.middlewares = rootPath + '/methods/middlewares.js';
methods.space = rootPath + '/methods/space.js';
methods.helper = rootPath + '/methods/helper.js';
methods.fix_or_maintain = rootPath + '/methods/fix_or_maintain.js';

exports.methods = methods;
/**************************** Space ****************************/
let space = {};
space.locales = {};

space.relPath = './space/';
space.articlesFolderName = 'articles/';
space.resourcesFolderName = 'resources/';
space.siteFolderName = 'site/';
space.slideshowFolderName = 'slideshow/';
space.onlineServicesFolderName = 'online_services/';

space.locales = rootPath + '/public/locales/';

exports.space = space;
/**************************** Codes ****************************/
let codes = {};

codes.notAllowed = -5;
codes.db = {};
codes.db.Error = -2;
codes.db.docNotFound = -3;
codes.db.docFound = 2;
codes.db.success = true;
codes.space = {};
codes.space.error = -1;
codes.space.success = 11;
codes.validationError = -4;
codes.lackOfInformation = -6;
codes.general = {};
codes.general.error = -10;
codes.general.success = 3;

exports.codes = codes;