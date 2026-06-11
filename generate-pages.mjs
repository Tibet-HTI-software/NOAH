/* Genereert de 4 dienst-detailpagina's uit data + één template.
   Run:  node generate-pages.mjs                                          */
import { writeFile } from "node:fs/promises";

/* ---- Iconen (inner SVG) ------------------------------------------------ */
const I = {
  wall: '<path d="M4 4h16v16H4zM4 9h16M4 14h16M9 4v5M14 9v5M9 14v6" stroke-linejoin="round"/>',
  roof: '<path d="M2 12 12 4l10 8M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/>',
  snow: '<path d="M12 3v18M5 8l7 4 7-4M5 16l7-4 7 4" stroke-linecap="round" stroke-linejoin="round"/>',
  hammer: '<path d="m14 7 6 6M3 21l8-8M14 7l3-3 4 4-3 3M14 7l-3 3" stroke-linecap="round" stroke-linejoin="round"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/>',
  brush: '<path d="M9 11l6-6 4 4-6 6M9 11l-3 6 6-3M9 11l3 3" stroke-linecap="round" stroke-linejoin="round"/>',
  layout: '<path d="M4 4h16v16H4zM4 9h16M9 9v11" stroke-linejoin="round"/>',
  building: '<path d="M4 21V5l8-2 8 2v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6" stroke-linecap="round" stroke-linejoin="round"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" stroke-linejoin="round"/>',
  gutter: '<path d="M3 8h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8zM8 16v4" stroke-linecap="round" stroke-linejoin="round"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${I[k]}</svg>`;
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4 10-10" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---- Data -------------------------------------------------------------- */
const services = [
  {
    file: "diensten-isolatie.html", titleTop: "Onze", accent: "isolatie", ogImg: "dienst-isolatie.jpg",
    metaTitle: "Isolatie", lead: "Professionele isolatie-oplossingen voor muren, daken en vloeren. Wij combineren vakmanschap met de nieuwste materialen voor een energiezuinige toekomst.",
    metaDesc: "Muur-, dak-, vloer- en na-isolatie met de hoogste kwaliteitsnormen voor een energiezuinige woning in regio Antwerpen.",
    sections: [
      { id: "muur", icon: "wall", title: "Muurisolatie", sub: "Bescherm uw muren tegen warmteverlies",
        desc: "Een van de meest effectieve manieren om uw energiefactuur te verlagen is muurisolatie. Of het nu gaat om spouwmuur-, buitenmuur- of binnenmuurisolatie, wij bieden de juiste techniek voor uw woning.",
        details: [
          { h: "Spouwmuurisolatie", c: "De meest rendabele oplossing. Via kleine openingen in de gevel blazen we hoogwaardige EPS-parels of minerale wol in de spouw. Een niet-invasieve ingreep die binnen één dag klaar is." },
          { h: "Buitenmuurisolatie", c: "Ideaal voor een volledige gevelrenovatie. We plaatsen isolatieplaten tegen de buitenzijde en werken deze af met crepi, steenstrips of panelen naar keuze." } ],
        benefits: ["Tot 25% besparing op stookkosten", "Verhoogde geluidsisolatie", "Geen breekwerken nodig bij spouwmuur"] },
      { id: "dak", icon: "roof", title: "Dakisolatie", sub: "Houd de warmte binnen waar het hoort",
        desc: "Tot 30% van de warmte verlaat een woning via een niet-geïsoleerd dak. Dakisolatie is de eerste stap naar een energiezuinige woning.",
        details: [
          { h: "Hellend dak (langs binnen)", c: "De meest gekozen methode. We plaatsen isolatiemateriaal zoals minerale wol of PIR-platen tussen de dakspanten, afgewerkt met een luchtdicht dampscherm." },
          { h: "Sarkingdak (langs buiten)", c: "Beste keuze bij een volledige dakrenovatie. De isolatie wordt bovenop de dakstructuur geplaatst, waardoor koudebruggen volledig worden uitgesloten." } ],
        benefits: ["Snelst terugverdiende investering", "Directe invloed op uw EPC-score", "Beschermt tegen oververhitting in de zomer"] },
      { id: "vloer", icon: "snow", title: "Vloerisolatie", sub: "Loop nooit meer op een koude vloer",
        desc: "Vloerisolatie zorgt niet alleen voor warmere voeten, maar voorkomt ook dat vocht uit de kruipruimte uw woning binnendringt.",
        details: [
          { h: "Kruipruimte-isolatie", c: "Heeft uw woning een kruipruimte, dan isoleren we de onderzijde van de werkvloer met gespoten PUR of isolatieplaten. Snel, efficiënt en zeer effectief." },
          { h: "Bovenvloer-isolatie", c: "Is er geen kruipruimte, dan werken we met isolerende chape of drukvaste isolatieplaten onder de nieuwe vloerafwerking." } ],
        benefits: ["Einde aan koude voeten", "Voorkomt vocht en schimmel in huis", "Ideaal in combinatie met vloerverwarming"] },
      { id: "na-isolatie", icon: "hammer", title: "Na-isolatie", sub: "Renoveren met oog voor de toekomst",
        desc: "Na-isolatie is de sleutel tot het moderniseren van oudere woningen zonder grote ingrepen. We optimaliseren de bestaande schil met de nieuwste materialen.",
        details: [
          { h: "Zoldervloer na-isolatie", c: "Wordt de zolder niet gebruikt als leefruimte? Dan is het isoleren van de zoldervloer de slimste en voordeligste manier om warmteverlies direct te stoppen." },
          { h: "Koudebruggen wegwerken", c: "Onze experts analyseren uw woning op zwakke plekken en dichten deze af om tocht en warmteverlies bij aansluitingen te voorkomen." } ],
        benefits: ["Kleine investering, groot resultaat", "Hogere waarde bij verkoop", "Voldoet aan de nieuwste Vlaamse normen"] },
    ],
    faq: [
      { q: "Welke premies bestaan er voor isolatie?", a: "Vlaanderen ondersteunt isolatiewerken onder meer via Mijn VerbouwPremie. Welke premies voor uw woning gelden, hangt af van uw situatie en het type werken. Wij bekijken dit samen met u en helpen bij de aanvraag." },
      { q: "Hoe lang duren isolatiewerken gemiddeld?", a: "Spouwmuurisolatie is doorgaans op één dag klaar, zonder breekwerk. Dak- en vloerisolatie nemen afhankelijk van de oppervlakte één tot enkele dagen in beslag. U krijgt vooraf een duidelijke planning." },
      { q: "Wat brengt isoleren concreet op?", a: "Goede isolatie bespaart al snel tot een kwart op uw stookkosten, verhoogt het comfort in zomer én winter en verbetert uw EPC-score — wat de waarde van uw woning ten goede komt." },
    ],
  },
  {
    file: "diensten-renovatie.html", titleTop: "Totaal", accent: "renovatie", ogImg: "dienst-renovatie.jpg",
    metaTitle: "Renovatie", lead: "Uw partner voor integrale verbouwingen. Wij transformeren verouderde woningen in moderne, duurzame en comfortabele droomhuizen.",
    metaDesc: "Van kleine aanpassingen tot volledige totaalrenovaties. Wij transformeren uw woning met oog voor detail en vakmanschap.",
    sections: [
      { id: "totaalrenovatie", icon: "home", title: "Totaalrenovatie", sub: "Complete transformatie van uw woning",
        desc: "Wij nemen uw volledige renovatieproject uit handen. Van afbraakwerken tot de laatste afwerkingsdetails coördineren wij het volledige proces voor een zorgeloze ervaring.",
        details: [
          { h: "Ruwbouw & structuur", c: "Aanpassingen aan de indeling, herstel van muren en funderingen, en het creëren van nieuwe ruimtes. Wij leggen de basis voor een duurzame woning." },
          { h: "Energetische upgrade", c: "Wij integreren moderne technieken en isolatie in uw renovatie, zodat uw woning voldoet aan de strengste energie-eisen van de toekomst." } ],
        benefits: ["Eén aanspreekpunt voor het hele project", "Strakke planning en kwaliteitscontrole", "Verhoogt de marktwaarde aanzienlijk"] },
      { id: "binnenafwerking", icon: "brush", title: "Binnenafwerking", sub: "Vakmanschap in elk detail",
        desc: "De binnenkant van uw woning bepaalt uw woonplezier. Wij zorgen voor een vlekkeloze afwerking van muren, plafonds en vloeren met oog voor esthetiek.",
        details: [
          { h: "Pleister- & gyprocwerken", c: "Strakke wanden en naadloze plafonds. Wij creëren de perfecte basis voor uw interieur met hoogwaardige materialen en technieken." },
          { h: "Vloer- & tegelwerken", c: "Of het nu gaat om keramische tegels, parket of laminaat, wij leggen uw vloeren met uiterste precisie voor een duurzaam resultaat." } ],
        benefits: ["Hoogwaardige afwerkingsgraad", "Gebruik van duurzame materialen", "Persoonlijk advies over kleur en stijl"] },
      { id: "zolder", icon: "hammer", title: "Zolderinrichting", sub: "Creëer extra leefruimte onder uw dak",
        desc: "Een ongebruikte zolder is verspilde ruimte. Wij transformeren uw zolder tot een prachtige slaapkamer, kantoor of hobbyruimte, inclusief isolatie en dakramen.",
        details: [
          { h: "Extra slaapkamer of kantoor", c: "Wij ontwerpen en realiseren een functionele indeling die past bij uw behoeften, inclusief elektrische installaties en verlichting." },
          { h: "Isolatie & daglicht", c: "Wij combineren de inrichting direct met hoogwaardige dakisolatie en het plaatsen van dakramen voor optimaal comfort en lichtinval." } ],
        benefits: ["Maximale benutting van uw woning", "Waardevast investeren", "Complete realisatie van A tot Z"] },
    ],
    faq: [
      { q: "Begeleiden jullie het volledige renovatietraject?", a: "Ja. U krijgt één vast aanspreekpunt dat alles coördineert: van de eerste offerte en het plaatsbezoek tot de uitvoering en de oplevering. Zo hoeft u zelf niets op te volgen." },
      { q: "Hoe lang duurt een totaalrenovatie?", a: "Dat hangt af van de omvang van het project. Reken gemiddeld op 8 tot 16 weken voor een volledige renovatie. U ontvangt vooraf een realistische planning die we strikt opvolgen." },
      { q: "Kan ik in mijn woning blijven wonen tijdens de werken?", a: "Vaak wel: we werken waar mogelijk in fases zodat een deel van de woning bewoonbaar blijft. Tijdens het plaatsbezoek bekijken we wat haalbaar is voor uw situatie." },
    ],
  },
  {
    file: "diensten-gevelbekleding.html", titleTop: "Gevel", accent: "bekleding", ogImg: "dienst-gevel.jpg",
    metaTitle: "Gevelbekleding", lead: "Transformeer uw gevel met duurzame materialen en een hoogwaardige afwerking. Esthetiek en isolatie in één totaaloplossing.",
    metaDesc: "Geef uw woning een nieuwe uitstraling met duurzame gevelbekleding: crepi, steenstrips en gevelreiniging.",
    sections: [
      { id: "crepi", icon: "layout", title: "Crepi (sierpleister)", sub: "Een moderne en strakke gevelafwerking",
        desc: "Crepi is de ideale keuze voor wie houdt van een moderne, egale look. In combinatie met gevelisolatie verbetert u niet alleen de esthetiek, maar ook de energie-efficiëntie van uw woning.",
        details: [
          { h: "Mineraal vs. siliconen", c: "Wij werken met zowel minerale pleister als siliconenharspleister. Mineraal is perfect voor dikkere lagen en renovaties, siliconen biedt hoge waterafstotendheid en flexibiliteit tegen barsten." },
          { h: "Kleur- & structuuropties", c: "Met een breed scala aan kleuren en korrelgroottes stemmen we de crepi volledig af op de gewenste uitstraling van uw woning." } ],
        benefits: ["Naadloze afwerking", "Uitstekende prijs-kwaliteitverhouding", "Vochtafstotend en ademend"] },
      { id: "steenstrips", icon: "building", title: "Steenstrips", sub: "Behoud de authentieke baksteenlook",
        desc: "Wilt u de charme van een bakstenen gevel behouden maar toch optimaal isoleren? Steenstrips zijn dunne plakken echte baksteen die direct op isolatieplaten worden verlijmd.",
        details: [
          { h: "Ruimtebesparend design", c: "Door de geringe dikte van steenstrips verliest u nauwelijks ruimte en hoeven funderingen vaak niet te worden aangepast, zelfs bij dikke isolatiepakketten." },
          { h: "Onzichtbare voegen", c: "Na het opvoegen is het resultaat niet te onderscheiden van een traditioneel gemetselde muur: de kracht van baksteen met de prestaties van moderne isolatie." } ],
        benefits: ["Authentieke uitstraling", "Onderhoudsarm en slagvast", "Geen funderingsaanpassingen nodig"] },
      { id: "reiniging", icon: "brush", title: "Gevelreiniging", sub: "Geef uw gevel een tweede leven",
        desc: "Soms is een nieuwe laag niet nodig. Wij reinigen uw gevel van mos, algen en vervuiling om de oorspronkelijke glans en bescherming te herstellen.",
        details: [
          { h: "Hydrofuge (impregneren)", c: "Na de reiniging behandelen we de gevel met een waterafstotende laag. Dit voorkomt dat vocht diep in de muren dringt en beschermt tegen vorstschade." },
          { h: "Stoom- & zandstralen", c: "Afhankelijk van de ondergrond kiezen we de meest zachte maar effectieve methode om jarenlange vervuiling zonder schade te verwijderen." } ],
        benefits: ["Directe esthetische verbetering", "Verlengt de levensduur van de gevel", "Verbetert de vochthuishouding"] },
    ],
    faq: [
      { q: "Wat is het verschil tussen crepi en steenstrips?", a: "Crepi geeft een strakke, naadloze en moderne look in elke gewenste kleur. Steenstrips behouden de authentieke baksteenuitstraling. Beide worden op gevelisolatie geplaatst — de keuze is vooral esthetisch." },
      { q: "Moet mijn gevel eerst geïsoleerd worden?", a: "Het is de ideale combinatie: u vernieuwt de gevel én isoleert in één beweging, wat recht geeft op premies. Een nieuwe afwerking zonder isolatie kan ook — we adviseren wat voor uw woning het slimst is." },
      { q: "Hoeveel onderhoud vraagt een crepi-gevel?", a: "Weinig: crepi is vochtafstotend en kleurvast. Een periodieke zachte reiniging volstaat om de gevel er jarenlang fris te laten uitzien." },
    ],
  },
  {
    file: "diensten-dakwerken.html", titleTop: "Vakkundige", accent: "dakwerken", ogImg: "dienst-dak.jpg",
    metaTitle: "Dakwerken", lead: "Van kleine herstellingen tot volledige dakrenovaties. Wij garanderen een waterdicht en duurzaam resultaat voor elk type dak.",
    metaDesc: "Kwaliteitsvolle dakwerken voor hellende en platte daken. Wij garanderen een waterdicht resultaat voor jarenlang wooncomfort.",
    sections: [
      { id: "dakrenovatie", icon: "roof", title: "Dakrenovatie", sub: "Een solide basis boven uw hoofd",
        desc: "Een dak is meer dan bescherming; het is de belangrijkste barrière tegen de elementen. Wij voeren volledige dakrenovaties uit met focus op duurzaamheid en isolatie.",
        details: [
          { h: "Pannen & leien", c: "Wij vervangen versleten dakbedekking door hoogwaardige keramische pannen, betonpannen of natuurleien, met een perfecte uitlijning en waterdichte afwerking." },
          { h: "Onderdak & structuur", c: "Indien nodig versterken we de houten dakconstructie en plaatsen we een modern dampopen onderdak om uw woning te beschermen tegen stuifsneeuw en wind." } ],
        benefits: ["100% water- en winddicht", "Verbetert de thermische prestaties", "Lange levensduur met garantie"] },
      { id: "platte-daken", icon: "shield", title: "Platte daken (EPDM)", sub: "Duurzame waterdichting voor jarenlang plezier",
        desc: "Voor platte daken werken wij voornamelijk met EPDM. Dit synthetische rubber heeft een levensverwachting van meer dan 50 jaar en blijft uiterst flexibel.",
        details: [
          { h: "EPDM-rubberbedekking", c: "EPDM wordt naadloos (of met geteste naden) geplaatst. Het is uv-bestendig, wortelvast (ideaal voor groendaken) en vergt nauwelijks onderhoud." },
          { h: "Isolatie bij platte daken", c: "Wij passen de 'warm dak'-methode toe, waarbij de isolatie bovenop de constructie onder de EPDM-laag komt voor maximale prestaties." } ],
        benefits: ["Levensduur van 50+ jaar", "Uiterst elastisch en scheurvrij", "Milieuvriendelijk en recyclebaar"] },
      { id: "herstellingen", icon: "gutter", title: "Dakgoten & herstellingen", sub: "Snelle hulp bij lekkages en schade",
        desc: "Kleine problemen kunnen grote schade veroorzaken. Wij staan klaar voor snelle herstellingen aan uw dakbedekking, zinkwerken of dakgoten om erger te voorkomen.",
        details: [
          { h: "Zink- & koperwerken", c: "Wij herstellen of vernieuwen uw dakgoten en afvoerpijpen in zink of koper voor een efficiënte afvoer van regenwater en een klassieke look." },
          { h: "Stormschade & lekkages", c: "Last van een lek of losgewaaide pannen na een storm? Ons team grijpt snel in om uw woning weer veilig en droog te maken." } ],
        benefits: ["Voorkomt kostbare waterschade", "Vakkundige zinkherstellingen", "Snel bereikbaar voor noodgevallen"] },
    ],
    faq: [
      { q: "Hoe snel kunnen jullie bij een lek ter plaatse zijn?", a: "Bij acute problemen zoals lekkage of stormschade proberen we zo snel mogelijk langs te komen om erger te voorkomen. Neem meteen contact op — ook een voorlopige noodoplossing kan veel schade besparen." },
      { q: "Hoe lang gaat een EPDM-dak mee?", a: "EPDM-rubber heeft een levensverwachting van meer dan 50 jaar. Het is uv-bestendig, blijft elastisch en vraagt nauwelijks onderhoud — een van de duurzaamste oplossingen voor platte daken." },
      { q: "Vernieuwen jullie ook dakgoten en afvoer?", a: "Ja, wij herstellen en vernieuwen dakgoten en afvoerpijpen in zink of koper, inclusief een correcte afwatering. Dit kan los of samen met een dakrenovatie." },
    ],
  },
];

/* ---- Gedeelde onderdelen ---------------------------------------------- */
const header = `  <header class="header" data-overlay="false">
    <div class="container header__inner">
      <a class="header__logo" href="index.html" aria-label="NOAH — home"><img src="assets/img/logo.png" alt="NOAH logo" /></a>
      <nav class="nav" aria-label="Hoofdnavigatie">
        <a class="nav__link" href="index.html">Home</a>
        <a class="nav__link" href="over-ons.html">Over ons</a>
        <div class="nav__item has-dropdown">
          <a class="nav__link" href="diensten.html" aria-current="page" aria-expanded="false">Diensten
            <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
          <div class="dropdown">
            <a class="dropdown__item" href="diensten-isolatie.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h18M3 14h18M5 5h14M5 19h14" stroke-linecap="round"/></svg></span><span><strong>Isolatie</strong><small>Spouwmuur, dak, vloer &amp; na-isolatie</small></span></a>
            <a class="dropdown__item" href="diensten-renovatie.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong>Renovatie</strong><small>Totaalrenovatie &amp; binnenafwerking</small></span></a>
            <a class="dropdown__item" href="diensten-gevelbekleding.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h16v16H4zM4 9h16M4 14h16M9 4v5M14 9v5M9 14v6" stroke-linejoin="round"/></svg></span><span><strong>Gevelbekleding</strong><small>Crepi, steenstrips &amp; reiniging</small></span></a>
            <a class="dropdown__item" href="diensten-dakwerken.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12 12 4l10 8M5 10v10h14V10" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><strong>Dakwerken</strong><small>Pannen, EPDM &amp; dakgoten</small></span></a>
            <a class="dropdown__all" href="diensten.html">Alle diensten <span class="arrow">&rarr;</span></a>
          </div>
        </div>
        <a class="nav__link" href="realisaties.html">Realisaties</a>
        <a class="nav__link" href="contact.html">Contact</a>
      </nav>
      <div class="header__actions"><a class="btn btn--primary" href="offerte.html">Offerte aanvragen <span class="arrow">&rarr;</span></a></div>
      <button class="nav-toggle" aria-label="Menu openen" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>`;

const contactInfo = `    <section class="section contact-info">
      <div class="container">
        <span class="eyebrow">Bereik ons vandaag</span>
        <h2 style="font-size:var(--fs-h2);max-width:18ch">Wij horen graag <span style="color:var(--green)">van u.</span></h2>
        <div class="contact-info__grid">
          <div class="contact-info__item"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18v12H3zM3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3>E-mail</h3><p>We reageren doorgaans binnen één werkdag.</p><a href="mailto:info@noah.be">info@noah.be</a></div>
          <div class="contact-info__item"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5"/></svg></div><h3>Werkregio</h3><p>Actief in Antwerpen &amp; omstreken.</p><span class="ci-value">Antwerpen, België</span></div>
          <div class="contact-info__item"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke-linejoin="round"/></svg></div><h3>Bel ons</h3><p>Beschikbaar tijdens kantooruren.</p><span class="ci-value todo">+32 (TODO)</span></div>
          <div class="contact-info__item"><div class="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></div><h3>Volg ons</h3><p>Onze realisaties &amp; updates.</p><a href="https://www.instagram.com/noahbvba/" target="_blank" rel="noopener">@noahbvba</a></div>
        </div>
      </div>
    </section>`;

const footer = `  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="index.html" aria-label="NOAH — home"><img src="assets/img/logo.png" alt="NOAH logo" /></a>
          <p class="footer__tag">Wij helpen uw woning vooruit met vakkundige isolatie, renovatie, gevel- en dakwerken in regio Antwerpen.</p>
        </div>
        <div class="footer__col"><h4>Diensten</h4><ul><li><a href="diensten-isolatie.html">Isolatie</a></li><li><a href="diensten-renovatie.html">Renovatie</a></li><li><a href="diensten-gevelbekleding.html">Gevelbekleding</a></li><li><a href="diensten-dakwerken.html">Dakwerken</a></li></ul></div>
        <div class="footer__col"><h4>Contact</h4><ul><li><a href="mailto:info@noah.be">info@noah.be</a></li><li><span class="todo">Tel: +32 (TODO)</span></li><li><span>Antwerpen, Belgi&euml;</span></li><li><a href="https://www.instagram.com/noahbvba/" target="_blank" rel="noopener">@noahbvba</a></li></ul></div>
        <div class="footer__col"><h4>Volg ons</h4><div class="socials"><a href="https://www.instagram.com/noahbvba/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3 1-3 3v2H8v3h3v6h3v-6h2.5l.5-3H14v-1.5c0-.5.3-1 1-1z"/></svg></a></div></div>
      </div>
      <div class="footer__bottom">
        <nav><a href="index.html">Home</a><a href="over-ons.html">Over ons</a><a href="diensten.html">Diensten</a><a href="realisaties.html">Realisaties</a><a href="offerte.html">Offerte</a><a href="contact.html">Contact</a></nav>
        <span>Antwerpen, Belgi&euml; &mdash; <span class="todo">BTW BE0&hellip; (TODO)</span></span>
      </div>
      <div class="footer__legal">
        <span>&copy; <span data-year>2026</span> NOAH Isolatie &amp; Renovatie &mdash; alle rechten voorbehouden</span>
        <!-- TODO: echte privacy- en cookiepagina's aanmaken -->
        <nav><a href="#">Privacy</a><a href="#">Cookies</a></nav>
      </div>
    </div>
  </footer>`;

/* ---- Template ---------------------------------------------------------- */
function sectionHtml(s) {
  const benefits = s.benefits.map((b) => `<div class="benefit">${check}<span>${b}</span></div>`).join("\n            ");
  const cards = s.details.map((d) => `<div class="detail-card"><h3>${d.h}</h3><p>${d.c}</p></div>`).join("\n          ");
  return `    <section class="detail" id="${s.id}">
      <div class="container detail__grid">
        <div class="reveal">
          <div class="detail__icon">${icon(s.icon)}</div>
          <h2 class="detail__title">${s.title}</h2>
          <p class="detail__sub">${s.sub}</p>
          <p class="detail__desc">${s.desc}</p>
          <div class="benefits">
            ${benefits}
          </div>
        </div>
        <div class="detail__cards reveal" data-delay="1">
          ${cards}
          <a class="btn btn--primary" href="offerte.html">Offerte voor ${s.title.toLowerCase()} <span class="arrow">&rarr;</span></a>
        </div>
      </div>
    </section>`;
}

function faqHtml(svc) {
  const items = svc.faq.map((f) => `          <details>
            <summary>${f.q} <span class="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></span></summary>
            <p class="faq__body">${f.a}</p>
          </details>`).join("\n");
  return `    <section class="section--tight">
      <div class="container">
        <div class="section-head reveal"><h2>Veelgestelde vragen</h2><p>Zit uw vraag er niet bij? Neem gerust contact op.</p></div>
        <div class="faq reveal">
${items}
        </div>
      </div>
    </section>`;
}

const faqSchema = (svc) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": svc.faq.map((f) => ({
    "@type": "Question", "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
});

function page(svc) {
  const sub = svc.sections.map((s) => `<a href="#${s.id}">${s.title}</a>`).join("\n          ");
  const sections = svc.sections.map(sectionHtml).join("\n\n");
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${svc.metaTitle} — NOAH Isolatie &amp; Renovatie</title>
  <meta name="description" content="${svc.metaDesc}" />
  <!-- TODO: vervang noah-isolatie.be door het echte domein zodra gekend -->
  <link rel="canonical" href="https://noah-isolatie.be/${svc.file}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${svc.metaTitle} — NOAH Isolatie &amp; Renovatie" />
  <meta property="og:description" content="${svc.metaDesc}" />
  <meta property="og:image" content="https://noah-isolatie.be/assets/img/${svc.ogImg}" />
  <meta property="og:locale" content="nl_BE" />
  <script type="application/ld+json">${faqSchema(svc)}</script>
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/tokens.css" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/pages.css" />
  <link rel="stylesheet" href="css/scroll-fx.css" />
</head>
<body>

  <a class="skip-link" href="#main">Meteen naar de inhoud</a>

${header}

  <main class="page" id="main">

    <section class="page-hero">
      <div class="container page-hero__inner">
        <a class="page-hero__back" href="diensten.html"><span class="arrow">&larr;</span> Alle diensten</a>
        <span class="eyebrow">Dienst</span>
        <h1>${svc.titleTop} <span class="accent">${svc.accent}</span></h1>
        <p class="page-hero__lead">${svc.lead}</p>
      </div>
    </section>

    <nav class="subnav" aria-label="Onderdelen">
      <div class="container subnav__inner">
          ${sub}
      </div>
    </nav>

${sections}

${faqHtml(svc)}

    <section class="section--tight realisaties-cta">
      <div class="container">
        <div class="realisaties-cta__split reveal">
          <h2>Klaar voor uw project?</h2>
          <div>
            <p>Onze experts staan klaar met een vrijblijvende offerte en advies op maat van uw woning.</p>
            <a class="btn btn--solid-light" href="offerte.html">Vraag een gratis offerte <span class="arrow">&rarr;</span></a>
          </div>
        </div>
      </div>
    </section>

${contactInfo}

  </main>

${footer}

  <button class="to-top" aria-label="Terug naar boven">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 14 6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>

  <!-- TODO: vervang 32400000000 door het echte WhatsApp-nummer -->
  <a class="wa-float" href="https://wa.me/32400000000" target="_blank" rel="noopener" aria-label="Chat met NOAH via WhatsApp">
    <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 4 1.6 6.2 1.6 6.6 0 12-5.3 12-11.9 0-3.2-1.3-6.2-3.5-8.4C23.7 4.7 20.7 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.3 1.4 1.4-4.2-.3-.4c-1.1-1.6-1.7-3.5-1.7-5.5 0-5.5 4.5-9.9 10-9.9 2.7 0 5.2 1 7 2.9 1.9 1.9 2.9 4.4 2.9 7 .1 5.4-4.4 9.9-9.9 9.9zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>
  </a>

  <script src="js/main.js"></script>
</body>
</html>
`;
}

for (const svc of services) {
  await writeFile(svc.file, page(svc), "utf8");
  console.log("✓", svc.file);
}
console.log("Klaar.");
