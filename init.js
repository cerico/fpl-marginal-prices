const PLAYER_CLASS = "PitchElementData__ElementValue-sc-1u4y6pr-2"
const RESET_CLASS = "kyzrFT"
const MAX_TEAM_SIZE = 15
const CHECK_INTERVAL_MS = 100
const TEAM_COLOR = "rgb(122, 221, 251)"
const SIDEBAR_COLOR = "rgb(0, 255, 135)"
const TRANSFER_COLOR = "rgb(255, 251, 0)"
const TAB_CLASS = "ism-nav__tab"
const PLAYER_TABLE_CLASS = "ElementTable-sc-1v08od9-0"
const SIDEBAR_CLASS = "bVraMK"
const PLAYER_ROW_CLASS = "ElementTable__ElementRow-sc-1v08od9-3"
const TITLE_CLASS = "btMbgK"
const PITCH_TAB_CLASS = "gQWwxM"

let teams
let allPlayers = {
  goalkeepers: [],
  defenders: [],
  midfielders: [],
  forwards: [],
  picks: [],
  cheapest: []
}

const subtractAndSetContent = (base, min) => {
  console.log("subtractAndSetContent", base.textContent, min)
  base.textContent = (parseFloat(base.textContent) - min).toFixed(1)
}

const handleTransferCalculation = (base, min) => {
  console.log("handleTransferCalculation")
  return ((parseFloat(base) - min) / 10).toFixed(1)
}

const playersWithSameName = (players, team) => {
  const t = teams.filter((t) => t.name === team)[0]
  const id = players.filter((p) => p.team === t.id)[0].id
  return id
}

const positionLookUp = (player) => {
  console.log("positionLookUp")
  if (player.position) {
    const pos = allPlayers.all.filter((a) => a.id === player.element)[0].element_type
    return allPlayers.cheapest.filter((e) => e.element_type === pos)[0].cost * 10
  } else {
    return allPlayers.cheapest.filter((e) => e.element_type === player.element_type)[0].cost * 10
  }
}

const setPlayerPrice = (player) => {
  console.log("setPlayerPrice")
  if (player.getElementsByTagName("td").length > 0 && player.style.background === "") {
    player.style.background = SIDEBAR_COLOR
    const playerPosition = player.getElementsByTagName("td")[1].getElementsByTagName("span")[1].textContent
    const price = player.getElementsByTagName("td")[2]
    const positionMap = {
      GKP: allPlayers.cheapest.filter((c) => c.element_type === 1)[0],
      DEF: allPlayers.cheapest.filter((c) => c.element_type === 2)[0],
      MID: allPlayers.cheapest.filter((c) => c.element_type === 3)[0],
      FWD: allPlayers.cheapest.filter((c) => c.element_type === 4)[0]
    }
    subtractAndSetContent(price, positionMap[playerPosition].cost)
  }
}

const handleSidebarPlayers = () => {
  console.log("handleSidebarPlayers")
  const playerTables = document.querySelector(`.${SIDEBAR_CLASS}`).getElementsByClassName(PLAYER_TABLE_CLASS)
  const players = Array.from(playerTables).reduce((acc, table) => {
    return acc.concat(Array.from(table.getElementsByClassName(PLAYER_ROW_CLASS)))
  }, [])
  players.forEach(setPlayerPrice)
}

const waitUntilElementReady = async (className) => {
  console.log("waitUntilElementReady")
  while ((elements = document.getElementsByClassName(className)).length < 1) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

const waitForCondition = async (conditionFunction, interval) => {
  console.log("waitForCondition")
  let result
  while (!(result = conditionFunction())) {
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
  return result
}

const checkTab = () => {
  const tab = document.querySelector(`.${TITLE_CLASS}`)
  return tab && tab.textContent === "Transfers"
}

const checkTeam = () => {
  console.log("checkTeam")
  const team = Array.from(document.getElementsByClassName(PLAYER_CLASS))
  const isTeamSizeValid = team.length === MAX_TEAM_SIZE
  return isTeamSizeValid ? team : null
}

const resetTeam = () => {
  window.location.reload()
}

const handleTeam = async () => {
  console.log("handleTeam")
  await waitForCondition(checkTab, CHECK_INTERVAL_MS)
  const team = await waitForCondition(checkTeam, CHECK_INTERVAL_MS)
  const positionMap = [
    ...Array(2).fill(allPlayers.cheapest.filter((c) => c.element_type === 1)[0]),
    ...Array(5).fill(allPlayers.cheapest.filter((c) => c.element_type === 2)[0]),
    ...Array(5).fill(allPlayers.cheapest.filter((c) => c.element_type === 3)[0]),
    ...Array(3).fill(allPlayers.cheapest.filter((c) => c.element_type === 4)[0])
  ]

  team.forEach((price, i) => {
    if (price.style.background !== TEAM_COLOR && price.style.background !== TRANSFER_COLOR) {
      subtractAndSetContent(price, positionMap[i].cost)
      price.style.background = TEAM_COLOR
    }
  })
}

const transferTabIsReady = () => {
  console.log("transferTabIsReady")
  handleTeam()
  const pitchTAB = document.querySelector(`.${PITCH_TAB_CLASS}`)
  pitchTAB.addEventListener("click", handleTeam, { once: false })
  const reset = Array.from(document.getElementsByClassName(RESET_CLASS)).find(
    (button) => button.textContent === "Reset"
  )
  reset.addEventListener("click", resetTeam, { once: false })
}

const formatData = async (data) => {
  console.log("formatData")
  const positions = {
    1: { name: "goalkeepers", short: "GKP" },
    2: { name: "defenders", short: "DEF" },
    3: { name: "midfielders", short: "MID" },
    4: { name: "forwards", short: "FWD" }
  }

  for (let i = 1; i <= 4; i++) {
    const playersInPosition = data.elements.filter((e) => e.element_type === i)
    const cheapestPlayer = getCheapestPlayer(playersInPosition)
    allPlayers[positions[i].name] = playersInPosition
    allPlayers.cheapest.push({
      position: positions[i].short.toLowerCase(),
      cost: cheapestPlayer,
      element_type: i,
      lol: 0
    })
  }

  allPlayers.all = data.elements
  teams = data.teams.map((t) => ({ id: t.id, name: t.name }))
}

const getCheapestPlayer = (players) => {
  console.log("getCheapestPlayer")
  return players.sort((a, b) => a.now_cost - b.now_cost)[0].now_cost / 10
}

const fetchData = async (url) => {
  console.log("fetchData")
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const fetchUserTeam = async (id) => {
  console.log("fetchUserTeam")
  const url = `https://fantasy.premierleague.com/api/my-team/${id}/`
  const data = await fetchData(url)
  allPlayers.picks = data.picks
  observeMutation()
  tabsAreReady()
  await waitUntilElementReady(PLAYER_CLASS)
  handleSidebarPlayers()
  transferTabIsReady()
}

const fetchCurrentUser = async () => {
  console.log("fetchCurrentUser")
  const url = "https://fantasy.premierleague.com/api/me/"
  const data = await fetchData(url)
  return data.player.entry
}

const fetchAllPlayersData = async () => {
  console.log("fetchAllPlayersData")
  const url = "https://fantasy.premierleague.com/api/bootstrap-static/"
  const data = await fetchData(url)
  return data
}

let shirt

const handleMutation = (mutations) => {
  console.log("handleBodyMutation")
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      if (mutation.removedNodes.length > 0) {
        if (mutation.removedNodes[0].lastChild?.attributes?.alt?.nodeName === "alt") {
          shirt = mutation.removedNodes[0].lastChild.attributes.alt.nodeValue
        }
      }
      if (mutation.target.classList.contains("fBGUqJ") && mutation.addedNodes.length === 1) {
        const playerNameElement = mutation.target.children[1].firstChild.textContent
        const possibles = allPlayers.all.filter((f) => f.web_name === playerNameElement)
        let id

        if (possibles.length > 1) {
          let team
          if (mutation.target.children[0].lastChild.alt) {
            team = mutation.target.children[0].lastChild.alt
          } else {
            team = shirt
          }
          id = playersWithSameName(possibles, team)
        } else {
          id = possibles[0].id
        }

        const current = allPlayers.picks.find((i) => i.element === id)

        if (current) {
          console.log(`removing a player ${id}`)
          const min = positionLookUp(current)
          const updatedCost = handleTransferCalculation(current.selling_price, min)
          mutation.target.children[1].lastChild.textContent = updatedCost
        } else {
          console.log(`adding a player ${id}`)
          const min = positionLookUp(allPlayers.all.find((f) => f.id === id))
          const nowCost = allPlayers.all.find((f) => f.id === id)?.now_cost
          const updatedCost = handleTransferCalculation(nowCost, min)
          mutation.target.children[1].lastChild.textContent = updatedCost
          mutation.target.children[1].lastChild.style.background = TRANSFER_COLOR
        }
      }
    } else {
      console.log("something went wrong")
    }
  }

  const shouldRunSidebarPlayers = mutations.some((mutation) => {
    return mutation.type === "childList" && mutation.target.firstChild?.classList?.contains(PLAYER_ROW_CLASS)
  })

  if (shouldRunSidebarPlayers) {
    handleSidebarPlayers()
  }
}

const observeMutation = () => {
  console.log("observeMutation")
  const options = {
    childList: true,
    subtree: true
  }

  const observer = new MutationObserver(handleMutation)
  const body = document.body

  observer.observe(body, options)
}

const changedToTransferPage = async () => {
  await waitUntilElementReady(SIDEBAR_CLASS)
  transferTabIsReady()
  handleSidebarPlayers()
}

const tabsAreReady = () => {
  const transferTab = Array.from(document.getElementsByClassName(TAB_CLASS)).find(
    (a) => a.textContent === "Transfers"
  )
  transferTab.addEventListener("click", changedToTransferPage, { once: false })
}

const initialize = async () => {
  console.log("initialize")
  const bootstrapData = await fetchAllPlayersData()
  await formatData(bootstrapData)
  const userId = await fetchCurrentUser()
  await fetchUserTeam(userId)
}

initialize()
