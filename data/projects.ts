import type { Project, ProjectCategory } from "@/lib/types";

/**
 * CASE FILES (spec §20–§23).
 *
 * Every entry points at a repository that exists and describes what that
 * repository actually contains — read from the source, not from memory. Where a
 * brief mentioned something the code does not do (payments, for instance), the
 * case study says so instead of repeating it.
 *
 * Adding a project = adding an object here. No component changes required.
 */
export const projects: Project[] = [
  {
    slug: "image-compressor-quality-evaluator",
    caseNumber: "001",
    title: "Image Compressor with Quality Evaluation",
    tagline: "Set a compression level, then see exactly what it cost in measured image quality.",
    summary:
      "A single-file browser tool that re-encodes an image at a chosen quality level and reports both sides of the trade-off — PSNR, SSIM and MSE against the original, plus the bytes actually saved. Nothing is uploaded: every step runs in the page.",
    category: "web",
    tech: ["JavaScript", "Canvas API", "HTML", "CSS", "Image Processing"],
    status: "completed",
    year: "2026",
    links: { repo: "https://github.com/ABD8421/Image-Compression" },
    featured: true,
    gallery: [],
    caseStudy: {
      overview:
        "An offline image compressor: load an image, move a quality slider between 1 and 100, and the tool re-encodes it in the browser and reports how many bytes were saved against how much fidelity was lost — measured, not estimated.",
      problem:
        "A quality slider is an opaque control. Choosing '70%' tells you nothing about whether the result is still usable, and most tools report the size saving only after the download, with no statement about what the compression did to the image.",
      objective:
        "Make the compression decision legible before the file is kept: put the measured quality loss next to the size gain, and translate the raw metric into a verdict someone without a background in image processing can act on.",
      solution:
        "The image is drawn to a canvas and re-encoded through canvas.toBlob at quality/100, producing a genuine JPEG from the browser's own encoder. The original and the re-encode are then sampled from ImageData and compared: MSE across the RGB channels, PSNR derived from that MSE, and an SSIM over luminance. SSIM also drives the interface — its value selects the colour and the wording of the quality label, so the number and the verdict can never disagree.",
      features: [
        "Quality slider from 1 to 100 with a live readout",
        "Compression performed entirely in the browser — no upload, no server round trip",
        "Original and compressed file sizes with the percentage saved and the compression ratio",
        "MSE, PSNR (dB) and SSIM to four decimal places, measured against the original pixels",
        "SSIM thresholds stated in plain language: excellent (above 0.95), good (above 0.85), acceptable (above 0.70), low (below)",
        "Download wired to the generated blob, so the file that was measured is the file that is saved",
      ],
      architecture:
        "One index.html holding the markup, a CSS design-token layer and the script. The pipeline is FileReader → Image → Canvas 2D → toBlob → ImageData, with URL.createObjectURL for the preview and the download. There is no build step, no dependency and no network call after load, so the tool works from a local copy with the network switched off.",
      role: "Solo — chose the metrics, wrote the pipeline and the interface, and set the thresholds the labels use.",
      implementation: [
        "Re-encoding goes through canvas.toBlob at quality/100 rather than a hand-written encoder, which keeps the tool to browser primitives and guarantees the output is a real JPEG at the requested level.",
        "MSE iterates with a stride of four and sums only the RGB channels, since alpha carries no visual information here and would dilute the error term.",
        "SSIM is computed on luminance (0.299 / 0.587 / 0.114 weights) rather than per channel — the metric's own definition — which keeps a three-pass comparison down to one.",
        "The ratio and the saving percentage are both derived from the actual blob sizes, so an increase shows as an increase instead of a wrapped negative.",
      ],
      challenges: [
        {
          challenge:
            "Comparing an original against its own re-encode requires both to be read from the same pixel grid.",
          resolution:
            "Both images are drawn to the canvas at the original's natural dimensions before getImageData runs, so the metrics compare like with like rather than two differently shaped buffers.",
        },
      ],
      results: [
        "A complete tool in one file: no dependencies, no build step, no upload, and it runs offline.",
        "The compressed output ships with the measurements needed to judge it — ratio, saving percentage, MSE, PSNR and SSIM.",
        "Quality is reported in words as well as numbers, which makes the metric usable without a specialist's background.",
      ],
      lessons: [
        "This SSIM is the single-window form: one pair of global means, variances and covariance for the whole image. It is fast, but it averages local damage away, so a blocky artefact in one region can hide inside a healthy global score. The 8×8 windowed variant with a mean map is the accurate version.",
        "The metrics run synchronously on the main thread, so a large image blocks the interface. Moving the comparison into a Web Worker would keep the slider responsive.",
        "A swipe or side-by-side comparison view would communicate the quality loss faster than any number does, and is the next thing worth adding.",
      ],
    },
  },
  {
    slug: "byte-blaze-blog-reader",
    caseNumber: "002",
    title: "Byte Blaze — Blog Reader",
    tagline: "A React reader over the DEV Community API, with Markdown rendering and offline bookmarks.",
    summary:
      "Browse the top articles from the DEV Community API, open one to read its full Markdown body or its author, and keep a bookmark list in the browser that survives a refresh — no account, no backend.",
    category: "web",
    tech: ["React", "React Router", "Vite", "Tailwind CSS", "REST API", "Markdown"],
    status: "completed",
    year: "2025",
    links: { repo: "https://github.com/ABD8421/byte-blaze" },
    featured: true,
    gallery: [],
    caseStudy: {
      overview:
        "A single-page blog reader: lists of top articles from a public API, a detail route that renders the article body, a nested route for its author, and a bookmark list persisted in localStorage.",
      problem:
        "Reading developer writing usually means leaving for a feed designed around engagement rather than reading, where the article worth returning to has scrolled away by the next visit.",
      objective:
        "Build a reader with a real routing model and its own persistence: the list, the article, the author and the saved items each get a URL, and a bookmark survives a reload without an account.",
      solution:
        "Routing is declarative and data-first — createBrowserRouter defines the tree and each route declares a loader that fetches the DEV API: twenty top articles for the index, one article for the detail route, with the body and the author as nested children over the same endpoint. Bookmarking is a small storage module that reads and writes localStorage, refuses a duplicate, reports the outcome through a toast, and renders an empty state when nothing is saved.",
      features: [
        "Article index loaded from the DEV Community API (top twenty)",
        "Article detail route rendering the Markdown body with react-markdown and rehype-raw",
        "Nested author route under the same article",
        "Bookmarks written to localStorage with duplicate detection and toast confirmation",
        "Bookmark removal, with an empty state that links back to the index",
        "404 artwork and spinner states for loading and failure",
        "Layout, header, footer and card components shared across routes",
      ],
      architecture:
        "React 18 built with Vite, react-router-dom v6 for the route tree (createBrowserRouter, RouterProvider, route loaders), Tailwind CSS with daisyUI for styling, react-markdown and rehype-raw for article bodies, react-hot-toast for feedback and react-spinners for loading. Data comes from the public DEV Community REST API; the only local state is the bookmark list in localStorage. There is no backend of its own.",
      role: "Solo — routing model, data loading, Markdown rendering and the bookmark layer.",
      implementation: [
        "Data is fetched in route loaders rather than in effects, so a route renders with its data already resolved and the navigation itself starts the request.",
        "The bookmark list is a small module (get, save, delete) over localStorage that rejects a duplicate id and says so with a toast, keeping storage rules out of the components.",
        "Article bodies arrive with raw HTML mixed into the Markdown, which is why the renderer includes rehype-raw — the payload is treated as content to render rather than as input to sanitise.",
      ],
      challenges: [
        {
          challenge:
            "Two views need the same article — the body and the author — without fetching it twice or duplicating the page.",
          resolution:
            "The author is a child route of the article with its own loader over the same endpoint, so each view is addressable and independently loadable.",
        },
        {
          challenge: "A component holds bookmarks in state while localStorage owns the truth.",
          resolution:
            "Every mutation goes through the storage module first and the component re-reads storage afterwards, so the interface shows what was actually persisted.",
        },
      ],
      results: [
        "List, article, author and bookmarks are each a real URL, so any view can be linked or reloaded directly.",
        "Bookmarks persist across sessions with no login, no server and no database.",
        "Article content is rendered from the API's own Markdown rather than copied into the app.",
      ],
      lessons: [
        "rehype-raw trusts the markup inside the payload. That is acceptable for a known API; if the source ever became user-generated, rehype-sanitize belongs in that pipeline.",
        "Re-reading storage after each mutation works but leaves two sources of truth. A single store or a small context would remove the class of bug where a component renders a stale list.",
        "The API is public and rate-limited, so a cache with revalidation would make repeat visits instant and reduce the load on someone else's service.",
      ],
    },
  },
  {
    slug: "bus-ticket-booking-interface",
    caseNumber: "003",
    title: "Bus Ticket Booking Interface",
    tagline: "Seat selection, coupons and a running fare total for an intercity bus operator.",
    summary:
      "A booking flow for a bus operator: choose seats from a live forty-seat map, unlock an offer coupon once three seats are selected, and read back the seats, class and total payable before confirming.",
    category: "web",
    tech: ["HTML", "Tailwind CSS", "JavaScript", "DOM APIs"],
    status: "completed",
    year: "2024",
    links: { repo: "https://github.com/ABD8421/bus-ticket" },
    featured: true,
    gallery: [],
    caseStudy: {
      overview:
        "A single-page booking interface for an intercity operator, built over the operator's own artwork — seat plan, ticket coupon, fare dividers and route banners.",
      problem:
        "Booking flows lose people at small points of friction: a seat map that does not reflect what is left, no signal about how many seats may be chosen, and a total that does not move when a discount is applied.",
      objective:
        "Take a ticket from seat selection to a checked total on one screen: unavailable seats are visibly unavailable, the selection limit is enforced rather than warned about afterwards, and a coupon changes the number the user is about to pay.",
      solution:
        "The seat map is the state. Each seat carries its state on the element, and one click handler updates everything that depends on it — the seats-left counter, the ticket list, the per-seat lines, the total and the grand total — then releases the coupon field once the selection reaches three seats. NEW15 (15%) and Couple20 (20%) recalculate the grand total, and a fourth selection is refused outright.",
      features: [
        "Seat map starting at forty available seats, decremented as seats are chosen",
        "Per-seat fare of 550 Taka accumulated into a total and a grand total",
        "Coupon field that stays disabled until three seats are selected, then accepts NEW15 or Couple20",
        "Ticket summary listing every selected seat with its class and fare",
        "Selection limit of four seats, enforced with an immediate message",
        "Banner, offers, ticket and footer sections built from the operator's own artwork",
        "Responsive layout: Tailwind breakpoints plus a dedicated mobile stylesheet",
      ],
      architecture:
        "One static page (index.html), one behaviour script (scirpt.js), a base stylesheet with a separate responsive override, and a Tailwind build configured through tailwind.config.js. There is no server and no persistence — the whole flow is client-side and the state lives in the DOM.",
      role: "Solo — implemented the layout, the styling and the booking interaction.",
      implementation: [
        "The DOM is the store: selection state is written onto the seat element and read back by the summary panel, which keeps one source of truth instead of synchronising an array against the markup.",
        "The seat limit is a guard at the top of the handler — a fourth selection alerts and returns before any state is touched, so an over-booked ticket cannot be constructed.",
        "The coupon field is released as a deliberate state change once the third seat is selected, which makes the pricing rule visible before someone tries a code that cannot yet work.",
        "Money is recalculated by the two functions that own it, rather than patched inside each branch.",
      ],
      challenges: [
        {
          challenge: "Keeping the summary panel, both counters and both totals consistent without a framework.",
          resolution:
            "Every seat click runs one ordered update path — counter, ticket list, line total, grand total — so the panel is redrawn from the current selection on each interaction and cannot drift.",
        },
        {
          challenge: "A coupon rule that depends on how many seats have been chosen.",
          resolution:
            "The rule is expressed as interface state: the field stays disabled until the selection reaches the threshold, which communicates the requirement instead of rejecting the code later.",
        },
      ],
      results: [
        "The complete booking flow — seats, limit, coupons, totals — runs in the browser with no backend and no dependency.",
        "The interface keeps an accurate seats-left count and refuses a fifth seat rather than accepting and then rejecting it.",
        "Ships as a static page that can be hosted anywhere, with Tailwind as the only build step.",
      ],
      lessons: [
        "Selection logic reads state back out of the DOM by traversal, which couples the script to the markup. A seat array plus a render function would be testable and would survive a markup change.",
        "The brief describes payment; what is implemented here is the booking interface, not a transaction. The total is a display value, and a real deployment needs a server that re-prices the booking — a client-side total is a request, never a price.",
        "Moving the coupon and pricing rules server-side would also stop a modified client from choosing its own discount.",
      ],
    },
  },
  {
    slug: "simple-diet-app",
    caseNumber: "004",
    title: "Simple Diet App",
    tagline: "A Flutter diet-planning home screen driven by three typed models.",
    summary:
      "A Flutter application for controlled diet planning: categories, diet plans and popular items each get a typed model, and the home screen composes them into one scrollable list with vector artwork.",
    category: "mobile",
    tech: ["Flutter", "Dart", "flutter_svg", "Material"],
    status: "completed",
    year: "2024",
    links: { repo: "https://github.com/ABD8421/simple-diet-app" },
    featured: true,
    gallery: [],
    caseStudy: {
      overview:
        "A Flutter app for people controlling what they eat, built around three model types — meal categories, diet plans and popular diets — rendered as a search-first home screen.",
      problem:
        "Diet information usually arrives as a wall of text. A plan is easier to follow when it is broken into categories, a small number of options per category, and a stable visual language for each.",
      objective:
        "Model the domain before the interface: one typed model per concept, with the screen assembled from those models instead of from data written inline in the widgets.",
      solution:
        "CategoryModel, DietModel and PopularDietsModel each expose a typed list, and the home screen is a StatefulWidget that loads them and lays out a search field, a category row, a diet section and a popular-diet list inside a single scrollable view. Icons and illustrations are vector assets rendered at runtime with flutter_svg.",
      features: [
        "One typed model per concept: category, diet plan, popular diet",
        "Home screen composing search, categories, diet plans and popular items",
        "Vector artwork rendered at runtime with flutter_svg",
        "Scrollable layout structured as a list of sections",
        "Generated Flutter project setup targeting both Android and iOS",
        "Widget test scaffold carried over from the Flutter template",
      ],
      architecture:
        "A standard Flutter application: main.dart as the entry point, lib/models for the domain types, lib/pages for the screen, and flutter_svg for vector assets. The android and ios folders are the generated platform scaffolding. There is no backend — the models supply their own lists.",
      role: "Solo — domain models, screen layout and asset pipeline.",
      implementation: [
        "Each model owns a static factory returning its typed list, so adding an item is a model change rather than a widget change.",
        "Sections are built as separate widget methods (search field, categories, diets, popular) and composed in one ListView, which keeps each part readable and independently changeable.",
        "Vector assets are used for the icons and illustrations so they stay sharp at any density instead of shipping one raster file per resolution.",
      ],
      challenges: [
        {
          challenge: "Keeping a long, mixed home screen readable in a single file.",
          resolution:
            "Each section has its own builder method and build() only decides the order, which keeps the composition visible at a glance.",
        },
        {
          challenge: "Rendering consistent artwork across screen densities.",
          resolution:
            "flutter_svg renders the vector assets directly, so no per-density raster variants are needed.",
        },
      ],
      results: [
        "One Dart codebase targeting both Android and iOS.",
        "A model layer separated from the screen, so a new section is a model plus a widget rather than an edit to existing data.",
        "The interface is composed from typed lists, which makes an API-backed source a contained change rather than a rewrite.",
      ],
      lessons: [
        "The lists are loaded inside build(), so they are rebuilt on every rebuild. Initialising in initState() is the correct place and removes that repeated work.",
        "The data lives inside the models. A repository interface behind them would let a nutrition API replace the sample data without touching the screen.",
        "State is held in a StatefulWidget; a small state-management layer would stop growth turning the page into one large widget.",
      ],
    },
  },
  {
    slug: "api-image-viewer",
    caseNumber: "005",
    title: "API Image Viewer",
    tagline: "A Flutter feed that fetches, parses and caches remote product data.",
    summary:
      "A Flutter screen that pulls a product feed from the Fake Store API, deserialises it into a typed model, and renders it as a list of cached network images with failure feedback.",
    category: "mobile",
    tech: ["Flutter", "Dart", "REST API", "GetX", "http", "cached_network_image"],
    status: "completed",
    year: "2024",
    links: { repo: "https://github.com/ABD8421/api-image-image" },
    featured: false,
    gallery: [],
    caseStudy: {
      overview:
        "A Flutter application whose job is the round trip: request a remote product feed over HTTP, turn the JSON into Dart objects, and render image, title and price for every item.",
      problem:
        "Remote data arrives as untyped maps. Rendering those maps directly spreads field names through the widgets, so a change to the response becomes a hunt through the interface.",
      objective:
        "Keep three concerns apart — where the data comes from, what it is, and how it is drawn — so each can change on its own.",
      solution:
        "An Api class holds the base URL and endpoints as constants; a Product model owns the JSON mapping through fromJson and toJson; the list widget consumes typed Product objects and nothing else. Images load through cached_network_image so scrolling does not refetch what is already on screen, and failures surface as toasts rather than as silent empty space.",
      features: [
        "Product feed fetched from the Fake Store API over HTTP",
        "Typed Product model with explicit JSON serialisation and deserialisation",
        "List rendering of image, title and price",
        "Network images cached, so repeat scrolls and rebuilds do not re-download",
        "Toast feedback when a request or an image load fails",
        "API base URL and endpoints centralised as constants",
      ],
      architecture:
        "A Flutter application using http for the request, GetX for state and navigation, cached_network_image for the image layer and fluttertoast for feedback. lib/api_service holds the endpoint definitions, lib/model holds the typed entity, and the list widget renders the parsed result. The data comes from the public Fake Store API, so the app carries no backend of its own.",
      role: "Solo — service layer, model mapping and the list interface.",
      implementation: [
        "Endpoints are constants in one class, so repointing the base URL at a staging host happens in a single place rather than at every call site.",
        "The model implements both directions of the mapping — fromJson for the response, toJson for reuse — which keeps the contract with the API in one file.",
        "Images go through cached_network_image rather than Image.network, because a scrolling feed rebuilds constantly and an uncached image would be re-requested each time.",
        "Failures are reported with a toast, so an empty list is never mistaken for an empty result.",
      ],
      challenges: [
        {
          challenge: "Keeping raw JSON field names out of the widgets.",
          resolution:
            "All mapping lives in Product.fromJson, so the interface only ever sees typed fields and a change to the response is a single-file edit.",
        },
        {
          challenge: "The cost of loading images in a long scrolling list.",
          resolution:
            "Cached network images plus a stable feed structure stop repeated rebuilds from turning into repeated downloads.",
        },
      ],
      results: [
        "A working integration end to end: request, typed parse, render, cached images and error feedback.",
        "One file to change when the API changes, and one file that defines where it lives.",
        "Runs on Android and iOS from the same Dart source.",
      ],
      lessons: [
        "Loading and error states are surfaced as toasts; an explicit state model (loading, loaded, empty, failed) rendered inside the layout would age better than transient notifications.",
        "The service returns decoded JSON directly. A repository between the service and the widget would give one place for caching, retries and typed errors.",
        "Every field is parsed without validation, so a missing key becomes a null that surfaces in the interface. Checking the response shape at the boundary would move that failure earlier.",
      ],
    },
  },
  {
    slug: "library-management-system",
    caseNumber: "006",
    title: "Library Management System",
    tagline: "A Windows desktop application for catalogue, members and book issue, backed by SQL Server.",
    summary:
      "A C# WinForms application for a library desk: sign in, manage the catalogue and members, issue a book, and read the complete issued-book record out of SQL Server.",
    category: "desktop",
    tech: ["C#", ".NET WinForms", "SQL Server", "ADO.NET", "DataSet"],
    status: "completed",
    year: "2023",
    links: { repo: "https://github.com/ABD8421/LibraryManagement" },
    featured: false,
    gallery: [],
    caseStudy: {
      overview:
        "A Windows desktop application covering the daily work of a library desk — sign in, a dashboard, adding and viewing books, adding students, issuing a book, and a complete record of what is currently out.",
      problem:
        "A paper register answers one question at a time. Answering 'what is issued, to whom, and what is still on the shelf' meant cross-checking records by hand.",
      objective:
        "Put the register in a relational database with a screen per task, so the desk can add a book or a member, issue a copy and read the full issued record without leaving the application.",
      solution:
        "One WinForms application with a form per operation — login, dashboard, add book, add student, issue book, complete book details and a book view — talking to a SQL Server database through ADO.NET, with a typed DataSet backing the tabular views and the connection string held in App.config.",
      features: [
        "Login screen gating the application",
        "Dashboard with menu navigation to each operation",
        "Add books with title, author, publication, purchase date, price and quantity",
        "Add students with their identifying details",
        "Issue a book to a student",
        "Complete issued-book details across the whole record",
        "SQL Server persistence through ADO.NET and a typed DataSet",
      ],
      architecture:
        "A .NET Framework WinForms application (v4.8) using System.Data.SqlClient for data access, a typed LibraryManagementDataSet for tabular binding, and App.config holding the connection string. Each screen is a Form and the dashboard navigates between them. The database is SQL Server Express, database name LibraryManagement.",
      role: "Solo — schema, forms and data access.",
      implementation: [
        "One form per operation keeps each screen small and makes the navigation path obvious from the dashboard.",
        "A typed DataSet provides the tabular views, which lets the grid controls bind to a defined shape rather than to ad-hoc rows.",
        "The connection string is held in App.config, the conventional .NET home for deployment-specific settings, so the database location is not compiled into the application.",
      ],
      challenges: [
        {
          challenge: "Moving between independent desktop forms while keeping the operation in context.",
          resolution:
            "The dashboard owns navigation and opens each form on demand, so one logged-in session carries the user through the whole workflow.",
        },
        {
          challenge: "Keeping the record consistent when books, students and issues are separate screens.",
          resolution:
            "All three write to the same database over the same SQL Server connection, so the issued-record view reflects the other screens without a synchronisation step.",
        },
      ],
      results: [
        "The full desk workflow — catalogue, members, issue, and the issued-book record — in one application.",
        "Data outlives the session: the register lives in SQL Server rather than in the interface.",
        "Kept as a complete, inspectable example of desktop CRUD over a relational database.",
      ],
      lessons: [
        "The insert is assembled by string concatenation from form fields, which is exactly the shape a SQL injection needs. Parameterised SqlCommand parameters are the fix and would be the first change I made today.",
        "The connection string is duplicated — one copy in App.config, another written into the form. Deployment settings belong in a single configuration source.",
        "Data access is written inside the forms. A small data-access layer behind an interface would make a schema change testable and would let the same logic back a different front end.",
      ],
    },
  },
  {
    slug: "salary-calculation-unit-tests",
    caseNumber: "007",
    title: "Salary Calculation with Unit Tests",
    tagline: "A pure calculation in its own file, exercised directly by a Dart test suite.",
    summary:
      "A deliberately small Flutter application built to practise separating logic from interface: the salary rule lives in a plain Dart class, and a test suite covers the boundary as well as both sides of it.",
    category: "academic",
    tech: ["Dart", "Flutter", "flutter_test", "Unit Testing"],
    status: "completed",
    year: "2024",
    links: { repo: "https://github.com/ABD8421/salary-unit-test" },
    featured: false,
    gallery: [],
    caseStudy: {
      overview:
        "A small application in three files: the salary calculation in my_function.dart, a home screen that uses it, and a suite in test/unit_testing.dart that tests the calculation directly.",
      problem:
        "Logic embedded in a widget can only be tested through the interface, which makes the test slow, indirect and easy to skip.",
      objective:
        "Practise the split that makes logic testable — a pure function with no widget dependency, and tests that call it without rendering anything.",
      solution:
        "The rule is an ordinary method on a plain class: up to 40 hours are paid at 400 per hour, above 40 at 600 per hour. The suite covers a single case (1 hour, 400) and a group covering both sides of the threshold (35 hours, 14,000; 45 hours, 27,000).",
      features: [
        "Salary calculation isolated in a plain Dart class, free of Flutter dependencies",
        "Single unit test covering the ordinary path",
        "Grouped tests covering each side of the 40-hour threshold",
        "Home screen consuming the same function the tests exercise",
        "flutter_test based suite that runs without a device or an emulator",
      ],
      architecture:
        "A standard Flutter project where the logic (lib/my_function.dart) is separated from the screen (lib/home_page.dart) and the entry point (lib/main.dart). The test file imports the logic module directly, so the suite has no dependency on the widget tree.",
      role: "Solo — wrote the rule, the screen and the tests.",
      implementation: [
        "The calculation lives in its own library file, so the import in the test suite is one line and the suite fails loudly if the function is moved or renamed.",
        "Tests are grouped around the threshold and named for the input they use, so a failure reads as 'the 45-hour case broke' rather than 'something in salary failed'.",
        "expect() takes the computed value first and the literal second, so a failure prints the expected and the actual number side by side.",
      ],
      challenges: [
        {
          challenge: "Testing a rule whose two branches are separated by a boundary.",
          resolution:
            "Each side of the boundary gets its own case, so a change to the comparison operator fails a test instead of quietly changing the pay of everyone under 40 hours.",
        },
      ],
      results: [
        "The salary rule is verified without launching the application.",
        "The suite runs in the standard flutter test pipeline, with no device or emulator.",
        "A worked example of why the split exists: pure logic is cheap to test.",
      ],
      lessons: [
        "The rule applies the higher rate to every hour once the threshold is crossed, so 45 hours pays 27,000 rather than 16,000 for the first 40 plus a premium on the remaining 5. A conventional overtime model pays the higher rate on the excess only — worth confirming which one the business intends before this number is trusted.",
        "The boundary itself — exactly 40 hours — is not covered, and it is the case most likely to break.",
        "The function takes an int and returns an int, so a negative hour count is accepted. A guard, or a type that cannot represent an invalid value, would close that off.",
      ],
    },
  },
  {
    slug: "genz-fashion-landing-page",
    caseNumber: "008",
    title: "GenZ Fashion Landing Page",
    tagline: "A Figma winter-collection design converted to a responsive static page.",
    summary:
      "A design-to-code exercise: a landing page for a winter collection, built from a supplied Figma file with a responsive layout, a product grid, and the design source committed alongside the implementation.",
    category: "academic",
    tech: ["HTML", "Tailwind CSS", "Figma", "Responsive Design"],
    status: "completed",
    year: "2025",
    links: { repo: "https://github.com/ABD8421/genZ" },
    featured: false,
    gallery: [],
    caseStudy: {
      overview:
        "A marketing page for a winter clothing collection — header, hero with a call to action, a product grid with prices and a supporting information section — built from the accompanying Figma design.",
      problem:
        "A design file is a set of intentions about hierarchy, spacing and breakpoints. The build either honours them or quietly replaces them, and the difference is usually invisible once the repository is the only thing left to review.",
      objective:
        "Produce the page as designed, at the sizes the design specifies, and keep the source design in the repository so the conversion can be checked against it.",
      solution:
        "The layout is built with Tailwind utilities against the design's own measurements — a maximum page width, a header that reflows from stacked to inline at the medium breakpoint, a hero with a large display heading over a two-column layout, and a product grid that steps from one column to two and then three. The Figma file and its exported PDF sit in the repository next to the markup.",
      features: [
        "Header with logo and navigation (Home, Product, Contact Us) that reflows at the medium breakpoint",
        "Hero section with a layered display heading, supporting copy and a BUY NOW call to action",
        "Product grid with item artwork, names and prices, stepping from one to three columns",
        "Supporting information section with icons",
        "Display typography for headings against a body face for copy",
        "Figma source file and exported PDF committed with the implementation",
      ],
      architecture:
        "A static page: one index.html styled with Tailwind utilities for layout and spacing, a small icon and image asset directory, and the source design (the .fig file plus its PDF export) stored beside it. Tailwind is loaded from the CDN, so there is no build step and no JavaScript of its own.",
      role: "Solo — converted the design into markup and styling.",
      implementation: [
        "Spacing and sizing follow the design's numbers through Tailwind's arbitrary-value syntax, which keeps the conversion literal instead of rounding to the nearest utility.",
        "Breakpoints are applied where the design changes structure — header reflow, grid column count — rather than at every size the framework offers.",
        "A page-level maximum width keeps the layout stable on very wide screens instead of letting the grid stretch without limit.",
      ],
      challenges: [
        {
          challenge: "Translating a fixed-size design into a layout that works below the design's width.",
          resolution:
            "Structural changes are tied to breakpoints (navigation, grid columns) while spacing scales with the container, so the page reflows instead of shrinking.",
        },
        {
          challenge: "Keeping the built page honest against the design.",
          resolution:
            "The .fig source and its PDF export are committed in the same repository, so the result can be compared with the intent rather than taken on trust.",
        },
      ],
      results: [
        "A responsive page matching a supplied design, built with a utility-first workflow.",
        "The design source is part of the repository, which makes the conversion reviewable.",
        "A worked example of the step between a Figma file and a shipped interface.",
      ],
      lessons: [
        "Arbitrary values kept the conversion accurate but made the markup dense. Extracting the repeated measurements into a small set of design tokens would make the next page faster to build and easier to keep consistent.",
        "The page has no interactive states beyond the browser defaults — hover, focus and active styling would be the first addition to make it feel finished.",
        "Loading Tailwind from the CDN is fine for a single page, but a real build would compile the stylesheet and keep the CDN out of the critical path.",
      ],
    },
  },
];

export const projectFilters: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI / ML" },
  { id: "desktop", label: "Desktop" },
  { id: "iot", label: "IoT" },
  { id: "academic", label: "Academic" },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Projects that share a category, excluding the current one. */
export function getRelatedProjects(slug: string, limit = 2): Project[] {
  const current = getProject(slug);
  if (!current) return [];
  return projects.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}
