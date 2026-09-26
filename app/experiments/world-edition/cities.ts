// Sample data for the "World Edition" experiment.
//
// The masthead (paper name) for each city is real — its actual most-read
// local outlet. Everything else (headlines, deks, bylines, body text) is
// placeholder text written for layout only, not scraped or translated from
// any real source. See the notes panel on the page itself for the full
// explanation and the plan for wiring up real data.

export type Story = {
  kicker?: string;
  headline: string;
  dek?: string;
  byline?: string;
  body: string[];
};

export type City = {
  city: string;
  country: string;
  paper: string;
  /** Only shown when non-empty — most outlets don't get an invented tagline. */
  tagline: string;
  lead: Story;
  side: Story[];
  weather: string;
  edition: string;
};

export const CITIES: City[] = [
  {
    city: "New York",
    country: "USA",
    paper: "The New York Times",
    tagline: "All the News That's Fit to Print",
    lead: {
      kicker: "TRANSIT",
      headline: "City council clears funding for cross-borough rail extension",
      dek: "Planners say the line could cut commute times by a third once construction wraps in 2031.",
      byline: "By a Metro Desk Correspondent",
      body: [
        "Officials approved the long-debated funding package after a marathon session that stretched past midnight, clearing the way for engineers to begin preliminary site work next spring.",
        "Supporters called it the most significant transit investment in a generation, while critics questioned the timeline and the cost overruns already built into early estimates.",
      ],
    },
    side: [
      { headline: "Harbor market vendors adapt to new licensing rules", body: ["Small business owners along the waterfront say the updated permit system is easier to navigate than last year's, though several still want clearer guidance on renewal windows."] },
      { headline: "Local orchestra opens season with a sold-out program", body: ["The hall's opening night drew its largest crowd in over a decade, according to venue staff, with a program built around a newly commissioned piece."] },
      { headline: "School district pilots expanded after-school arts programming", body: ["The pilot adds arts instruction at a dozen schools that previously had none, funded through a one-year grant."] },
      { headline: "Ferry service adds a new weekend route to the islands", body: ["Operators say the added route responds to rising weekend ridership over the past two seasons."] },
    ],
    weather: "58°F, overcast",
    edition: "Late City Edition",
  },
  {
    city: "London",
    country: "UK",
    paper: "The Guardian",
    tagline: "",
    lead: {
      kicker: "HOUSING",
      headline: "Ministers unveil plan to fast-track approvals for mid-size developments",
      dek: "The proposal aims to shorten planning delays that have stalled thousands of units across the capital.",
      byline: "By a Political Correspondent",
      body: [
        "The government's housing plan would compress review timelines for developments under a certain unit threshold, a change officials say could unlock stalled projects within eighteen months.",
        "Housing groups gave the plan a cautious welcome, while some local councils warned that faster approvals could strain already limited infrastructure.",
      ],
    },
    side: [
      { headline: "Underground signal fault causes morning delays across three lines", body: ["Commuters faced lengthy queues before engineers restored normal service by midday, transport officials confirmed."] },
      { headline: "Museum extends run of its architecture retrospective", body: ["Strong attendance figures prompted organizers to add six additional weeks to the exhibition's schedule."] },
      { headline: "Bakeries report rising demand amid a home-baking trend", body: ["Independent bakers say sourdough and rye orders have climbed steadily over the past several months."] },
      { headline: "Football club confirms stadium expansion timeline", body: ["Construction crews are expected to begin work on the new stand once the current season concludes."] },
    ],
    weather: "14°C, light rain",
    edition: "City Edition",
  },
  {
    city: "Tokyo",
    country: "Japan",
    paper: "The Yomiuri Shimbun",
    tagline: "",
    lead: {
      kicker: "ECONOMY",
      headline: "Manufacturers report steady export growth despite currency swings",
      dek: "Analysts point to resilient demand from overseas markets as a stabilizing factor this quarter.",
      byline: "By a Business Desk Writer",
      body: [
        "Export figures released this week showed a modest but steady climb, driven largely by demand for precision components and consumer electronics.",
        "Economists cautioned that currency volatility could still complicate forecasts heading into the next fiscal quarter.",
      ],
    },
    side: [
      { headline: "Cherry blossom forecast pushed back by a week", body: ["Meteorologists revised bloom predictions after a cooler-than-expected stretch of early spring weather."] },
      { headline: "Rail operator trials quieter carriage design", body: ["The pilot program, running on two lines, aims to reduce noise complaints during late-night service."] },
      { headline: "Convenience store chain expands cashless checkout trial", body: ["The chain says self-checkout lanes have cut average wait times at trial locations."] },
      { headline: "City announces new bicycle-sharing docks near major stations", body: ["The added docks target commuters making short trips from the station to nearby offices."] },
    ],
    weather: "19°C, clear",
    edition: "Morning Edition",
  },
  {
    city: "Paris",
    country: "France",
    paper: "Le Monde",
    tagline: "",
    lead: {
      kicker: "CULTURE",
      headline: "Renovated wing of national gallery reopens after five-year closure",
      dek: "Curators say the redesign gives long-stored works their first public display in over a decade.",
      byline: "By a Culture Desk Writer",
      body: [
        "The gallery's west wing reopened to the public this week, unveiling a collection of works that had remained in storage since the building's last major renovation.",
        "Officials said ticket demand for the opening weeks has already exceeded projections, prompting extended evening hours.",
      ],
    },
    side: [
      { headline: "Bakers' union proposes new apprenticeship standards", body: ["The plan would formalize training requirements that have varied widely between neighborhoods and regions."] },
      { headline: "River cruise operators report record season", body: ["Operators credit milder autumn weather and a rebound in international visitors for the strong numbers."] },
      { headline: "Fashion week organizers confirm expanded schedule for new designers", body: ["Organizers say the additional slots respond to record interest from emerging labels this year."] },
      { headline: "City extends bike lane network into two more districts", body: ["The extension connects previously isolated lanes into a more continuous citywide network."] },
    ],
    weather: "16°C, partly cloudy",
    edition: "City Edition",
  },
  {
    city: "Delhi",
    country: "India",
    paper: "The Times of India",
    tagline: "",
    lead: {
      kicker: "INFRASTRUCTURE",
      headline: "Metro authority approves third phase of network expansion",
      dek: "The new corridor is expected to connect two of the city's fastest-growing outer districts.",
      byline: "By a Staff Correspondent",
      body: [
        "Transport authorities signed off on the expansion after months of feasibility review, with construction expected to begin once land acquisition is finalized.",
        "Officials estimate the new corridor could serve several hundred thousand daily riders within its first years of operation.",
      ],
    },
    side: [
      { headline: "Air quality index improves for third straight day", body: ["Officials attributed the improvement to favorable wind patterns rather than any change in emissions policy."] },
      { headline: "Textile exporters see uptick in seasonal orders", body: ["Trade groups say early holiday demand from overseas buyers has arrived earlier than in past years."] },
      { headline: "Street food vendors propose new hygiene certification", body: ["The voluntary program would let participating stalls display a certification badge to customers."] },
      { headline: "University expands scholarship program for rural students", body: ["The expanded program adds several hundred new spots for students from outside the metro area."] },
    ],
    weather: "27°C, hazy",
    edition: "City Edition",
  },
  {
    city: "São Paulo",
    country: "Brazil",
    paper: "Folha de S.Paulo",
    tagline: "",
    lead: {
      kicker: "TRANSPORT",
      headline: "Bus network pilots dedicated lanes on three major avenues",
      dek: "Early data suggests commute times have dropped noticeably on the busiest of the three routes.",
      byline: "By a City Desk Reporter",
      body: [
        "The pilot, launched last month, restricts lanes on select avenues to buses during peak hours, a change officials hope will ease chronic congestion.",
        "Drivers' associations have pushed back on the plan, arguing it shifts traffic problems onto adjacent side streets.",
      ],
    },
    side: [
      { headline: "Coffee cooperative reports strong harvest outlook", body: ["Growers in the surrounding region say favorable rains have lifted expectations for the coming season."] },
      { headline: "Cultural center announces free weekend film series", body: ["The program, running through the season, will screen restored prints at no charge to the public."] },
      { headline: "Public library network extends weekend hours citywide", body: ["The change follows requests from students who said weekday hours conflicted with class schedules."] },
      { headline: "Startup incubator reports record applicant pool", body: ["Organizers say this cycle drew nearly double the applications of the previous round."] },
    ],
    weather: "24°C, sunny",
    edition: "City Edition",
  },
  {
    city: "Lagos",
    country: "Nigeria",
    paper: "Punch",
    tagline: "",
    lead: {
      kicker: "COMMERCE",
      headline: "Port authority announces upgrades to cargo processing systems",
      dek: "Officials say the changes are meant to cut clearance times that have frustrated importers for years.",
      byline: "By a Business Correspondent",
      body: [
        "The upgrade includes new scanning equipment and an expanded digital filing system, both aimed at reducing the paperwork backlog at the port's busiest terminals.",
        "Business groups welcomed the move but urged authorities to keep the new systems adequately staffed.",
      ],
    },
    side: [
      { headline: "Tech hub reports rise in early-stage funding rounds", body: ["Founders in the district say investor interest has picked up compared with the same period last year."] },
      { headline: "Ferry operators add extra weekend crossings", body: ["The added service responds to growing demand from commuters living across the water."] },
      { headline: "Designers showcase collections at regional trade fair", body: ["Organizers say buyer attendance was up compared with last year's edition."] },
      { headline: "Traffic authority pilots new signal timing downtown", body: ["Early results suggest the change has shortened average wait times at the busiest junctions."] },
    ],
    weather: "30°C, humid",
    edition: "City Edition",
  },
  {
    city: "Cairo",
    country: "Egypt",
    paper: "Al-Ahram",
    tagline: "",
    lead: {
      kicker: "HERITAGE",
      headline: "Restoration project completes work on second historic gate",
      dek: "Conservators say the project has taken longer than planned but preserved rare original stonework.",
      byline: "By a Heritage Desk Writer",
      body: [
        "The restoration, part of a multi-year effort, uncovered sections of stonework that conservators believe date to an earlier phase of the structure's history.",
        "Tourism officials hope the completed gate will become a draw for visitors once scaffolding is removed next month.",
      ],
    },
    side: [
      { headline: "River traffic authority updates seasonal navigation rules", body: ["The changes are meant to reduce congestion during the busiest shipping months."] },
      { headline: "Local market vendors report steady holiday demand", body: ["Shop owners say foot traffic has held steady despite a slower start to the season."] },
      { headline: "University unveils new archaeology research center", body: ["The center will house artifacts from several recent excavation projects in the region."] },
      { headline: "Bus operator adds routes serving new residential districts", body: ["The added service follows years of resident requests for better public transit access."] },
    ],
    weather: "25°C, clear",
    edition: "City Edition",
  },
  {
    city: "Moscow",
    country: "Russia",
    paper: "Komsomolskaya Pravda",
    tagline: "",
    lead: {
      kicker: "ENERGY",
      headline: "Utility announces grid modernization program for outer districts",
      dek: "The multi-year plan targets aging infrastructure blamed for repeated winter outages.",
      byline: "By an Energy Desk Writer",
      body: [
        "The utility said the first phase of upgrades will focus on substations serving the most outage-prone neighborhoods, with work expected to begin before winter.",
        "Residents in affected districts have complained for years about service reliability during peak cold months.",
      ],
    },
    side: [
      { headline: "Metro system tests new ventilation technology", body: ["Engineers say the pilot could reduce platform temperatures during peak summer months."] },
      { headline: "Publishing house reports rise in translated fiction sales", body: ["Editors point to a growing appetite for international literature among younger readers."] },
      { headline: "City orchestra announces expanded touring schedule", body: ["The ensemble will visit several new regional cities as part of next season's program."] },
      { headline: "Housing authority reports progress on courtyard renovation program", body: ["Officials say roughly a third of planned courtyards have been completed so far this year."] },
    ],
    weather: "2°C, snow flurries",
    edition: "City Edition",
  },
  {
    city: "Sydney",
    country: "Australia",
    paper: "The Sydney Morning Herald",
    tagline: "",
    lead: {
      kicker: "ENVIRONMENT",
      headline: "Council approves expanded coastal erosion protection plan",
      dek: "The plan includes new dune restoration work along several of the city's most popular beaches.",
      byline: "By an Environment Reporter",
      body: [
        "The council's plan calls for staged restoration work over the next three years, prioritizing beaches that have seen the steepest sand loss.",
        "Local surf clubs welcomed the announcement but asked for clearer timelines on when work would begin at each site.",
      ],
    },
    side: [
      { headline: "Ferry timetable adjusted ahead of summer season", body: ["Operators say the changes add capacity on routes that see the heaviest tourist demand."] },
      { headline: "University researchers report promising coral trial results", body: ["Early data from the offshore trial has encouraged marine biologists involved in the project."] },
      { headline: "Council approves bike path linking two harborside suburbs", body: ["The new path is expected to open in time for the next school year."] },
      { headline: "Weekend market vendors report strong turnout", body: ["Organizers say attendance has grown steadily since the market relocated to its current site."] },
    ],
    weather: "22°C, sunny",
    edition: "City Edition",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    paper: "El Universal",
    tagline: "",
    lead: {
      kicker: "WATER",
      headline: "City unveils phased plan to modernize aging water pipeline network",
      dek: "Officials say leaks in the decades-old system account for a significant share of water loss.",
      byline: "By a Staff Writer",
      body: [
        "The plan would replace sections of pipeline in the districts with the highest recorded leak rates, starting with pilot zones identified in a recent infrastructure audit.",
        "Residents' groups have long pushed for faster action on water loss, which has worsened during recent dry seasons.",
      ],
    },
    side: [
      { headline: "Craft market vendors prepare for seasonal festival", body: ["Organizers expect one of the largest turnouts in recent years for this month's gathering."] },
      { headline: "Bike-share program adds new stations downtown", body: ["City officials say ridership has grown steadily since the program's last expansion."] },
      { headline: "City expands tree-planting initiative into outer districts", body: ["Officials say the expansion targets neighborhoods with the least existing tree cover."] },
      { headline: "Cultural center reports record museum attendance this season", body: ["Staff credit a rotating schedule of visiting exhibitions for the increase."] },
    ],
    weather: "21°C, clear",
    edition: "City Edition",
  },
  {
    city: "Seoul",
    country: "South Korea",
    paper: "The Chosun Ilbo",
    tagline: "",
    lead: {
      kicker: "TECHNOLOGY",
      headline: "Semiconductor makers report strong quarter on export demand",
      dek: "Industry groups say global demand for advanced chips continues to outpace supply.",
      byline: "By a Technology Desk Writer",
      body: [
        "Manufacturers posted stronger-than-expected results this quarter, citing steady overseas orders for advanced memory and processing chips.",
        "Analysts said capacity constraints remain a concern heading into next year, even as new facilities come online.",
      ],
    },
    side: [
      { headline: "Subway system pilots real-time crowd density displays", body: ["The feature, currently limited to a handful of stations, aims to help riders avoid the most crowded cars."] },
      { headline: "Film festival announces record submission numbers", body: ["Organizers say entries from independent filmmakers rose sharply compared with last year."] },
      { headline: "City expands night bus routes for late-shift workers", body: ["The added routes serve districts with large concentrations of overnight employment."] },
      { headline: "Startup district reports growth in incubator applications", body: ["Program staff say interest has grown fastest among early-stage hardware ventures."] },
    ],
    weather: "12°C, clear",
    edition: "Morning Edition",
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    paper: "Kompas",
    tagline: "",
    lead: {
      kicker: "FLOODING",
      headline: "City accelerates drainage upgrades ahead of monsoon season",
      dek: "Engineers say the work targets neighborhoods hit hardest by flooding in recent years.",
      byline: "By a City Affairs Writer",
      body: [
        "Crews have begun clearing and widening canals in several flood-prone districts, part of a broader push to reduce seasonal flooding before the rains intensify.",
        "Residents in the affected areas welcomed the work but said similar promises in past years were only partially completed.",
      ],
    },
    side: [
      { headline: "Port authority reports rise in container traffic", body: ["Officials attribute the increase to steady regional trade demand."] },
      { headline: "Batik cooperative expands training program for young artisans", body: ["Organizers hope the expanded program will help preserve traditional techniques."] },
      { headline: "City pilots new public bike-share stations downtown", body: ["The pilot targets short trips between transit hubs and nearby office districts."] },
      { headline: "University opens new coastal research station", body: ["Researchers say the facility will focus on monitoring coastal erosion and water quality."] },
    ],
    weather: "29°C, humid",
    edition: "City Edition",
  },
  {
    city: "Istanbul",
    country: "Türkiye",
    paper: "Hürriyet",
    tagline: "",
    lead: {
      kicker: "TRANSPORT",
      headline: "Ferry authority adds new cross-strait routes for commuters",
      dek: "Officials say the added routes are meant to ease pressure on the busiest bridge crossings.",
      byline: "By a Transport Desk Writer",
      body: [
        "The new routes will run during peak commuting hours, offering an alternative for residents who currently rely on already congested bridge traffic.",
        "Transit officials said early ridership estimates suggest strong demand, particularly among commuters on the city's eastern side.",
      ],
    },
    side: [
      { headline: "Historic bazaar merchants report steady tourist season", body: ["Vendors say international visitor numbers have held up despite a slower start to the year."] },
      { headline: "University opens new marine research station", body: ["Researchers say the facility will focus on studying strait currents and marine biodiversity."] },
      { headline: "Municipality expands recycling collection to more districts", body: ["Officials say the expansion follows a successful pilot in the city's central neighborhoods."] },
      { headline: "Theater group announces expanded season lineup", body: ["The company will stage several new productions alongside returning favorites this year."] },
    ],
    weather: "17°C, breezy",
    edition: "City Edition",
  },
  {
    city: "Berlin",
    country: "Germany",
    paper: "Bild",
    tagline: "",
    lead: {
      kicker: "HOUSING",
      headline: "City extends rent stabilization measures for another two years",
      dek: "Officials say the extension gives lawmakers time to negotiate a longer-term housing framework.",
      byline: "By a City Affairs Correspondent",
      body: [
        "The extension keeps existing caps in place while a working group drafts a longer-term proposal, city officials confirmed this week.",
        "Landlord associations criticized the move as a delay tactic, while tenant groups called it a necessary bridge measure.",
      ],
    },
    side: [
      { headline: "Public library network expands digital lending catalog", body: ["The expansion adds several thousand titles available for remote checkout."] },
      { headline: "Cycling advocates welcome new protected lane segment", body: ["The addition connects two previously disconnected sections of the city's bike network."] },
      { headline: "City reports rise in community garden applications", body: ["Officials say demand for plots has outpaced available space in several districts."] },
      { headline: "Transit authority tests new night bus route", body: ["The trial route connects two neighborhoods that currently lack late-night service."] },
    ],
    weather: "11°C, overcast",
    edition: "City Edition",
  },
  {
    city: "Toronto",
    country: "Canada",
    paper: "Toronto Star",
    tagline: "",
    lead: {
      kicker: "HOUSING",
      headline: "City council approves zoning changes to speed mid-rise construction",
      dek: "Supporters say the change could add thousands of units along transit corridors over the next decade.",
      byline: "By a City Hall Reporter",
      body: [
        "The zoning changes allow mid-rise buildings by default along major transit corridors, removing a rezoning step that developers said added months of delay.",
        "Some neighborhood associations raised concerns about the pace of change, while housing advocates called it overdue.",
      ],
    },
    side: [
      { headline: "Transit agency tests contactless fare expansion on streetcars", body: ["The rollout follows a successful pilot on several bus routes earlier this year."] },
      { headline: "Film industry reports strong year for local production", body: ["Industry groups credit favorable exchange rates and expanded studio capacity."] },
      { headline: "City announces waterfront trail extension", body: ["The extension will link two parks that were previously reachable only by road."] },
      { headline: "Public library reports record digital lending numbers", body: ["Staff say e-book and audiobook checkouts have outpaced physical circulation this year."] },
    ],
    weather: "9°C, cloudy",
    edition: "City Edition",
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    paper: "Clarín",
    tagline: "",
    lead: {
      kicker: "CULTURE",
      headline: "Historic theater completes restoration ahead of anniversary season",
      dek: "The project preserved original ceiling murals that had been hidden for decades.",
      byline: "By a Culture Desk Writer",
      body: [
        "Restorers uncovered the original murals beneath later renovations, a discovery that shaped much of the final year of the project.",
        "The theater plans a special anniversary season once restoration work is fully complete next month.",
      ],
    },
    side: [
      { headline: "Farmers' cooperative reports strong grain export season", body: ["Officials say favorable weather boosted yields across several key growing regions."] },
      { headline: "City expands late-night bus service in tourist districts", body: ["The change follows requests from business owners in the affected neighborhoods."] },
      { headline: "Tango festival organizers announce expanded program", body: ["This year's edition will add several new venues across the city."] },
      { headline: "City reports growth in bike-share membership", body: ["Officials attribute the increase to newly added stations in outer neighborhoods."] },
    ],
    weather: "20°C, clear",
    edition: "City Edition",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    paper: "Thairath",
    tagline: "",
    lead: {
      kicker: "TOURISM",
      headline: "Tourism board reports strongest visitor numbers in five years",
      dek: "Officials credit expanded flight routes and a rebound in regional travel demand.",
      byline: "By a Tourism Desk Writer",
      body: [
        "Visitor arrivals climbed for a sixth consecutive month, according to figures released this week, with regional travelers accounting for much of the growth.",
        "Hotel operators say occupancy rates have returned to levels not seen since before the pandemic-era slowdown.",
      ],
    },
    side: [
      { headline: "Canal authority begins seasonal water quality testing", body: ["The program checks pollution levels ahead of the peak boating season."] },
      { headline: "Night market vendors report record weekend crowds", body: ["Organizers say cooler evening weather has helped draw larger crowds than usual."] },
      { headline: "City pilots new water taxi route along canal network", body: ["The route is meant to ease pressure on parallel road traffic during peak hours."] },
      { headline: "Street food vendors report steady weekday demand", body: ["Vendors say weekday lunch crowds have held steady despite rising ingredient costs."] },
    ],
    weather: "31°C, humid",
    edition: "City Edition",
  },
  {
    city: "Nairobi",
    country: "Kenya",
    paper: "Daily Nation",
    tagline: "",
    lead: {
      kicker: "AGRICULTURE",
      headline: "Coffee growers report improved yields after favorable rains",
      dek: "Cooperatives say the season's harvest could be the strongest in several years.",
      byline: "By an Agriculture Desk Writer",
      body: [
        "Growers across the region reported stronger-than-expected yields this season, a welcome change after several years of unpredictable rainfall.",
        "Cooperative leaders say the improved harvest could help stabilize prices for smallholder farmers heading into next year.",
      ],
    },
    side: [
      { headline: "Tech hub reports growth in mobile payment adoption", body: ["Officials say usage has expanded fastest among small and informal businesses."] },
      { headline: "National park authority reports rise in visitor numbers", body: ["Officials attribute the increase to expanded conservation marketing efforts abroad."] },
      { headline: "City announces new bus rapid transit corridor", body: ["The corridor is designed to cut commute times along one of the city's busiest arteries."] },
      { headline: "University reports growth in agricultural technology research", body: ["Researchers say funding for the program has doubled over the past two years."] },
    ],
    weather: "23°C, sunny",
    edition: "City Edition",
  },
];
