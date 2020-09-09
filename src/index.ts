const config = {
  chatbotUrl: "WEBHOOK_URL_HERE",
  projectUrl: "GOOGLE SCRIPT PROJECT URL HERE",
  retrospective: {
    sheetId: "SPREADSHEET ID HERE",
  }
}

function buildCard(personName, date, action, done, link) {
  const ret = {
    "header": {
      "title": "Ação da retrospectiva",
      "subtitle": "Para " + date
    },
    "sections": [
      {
        "widgets": [
          {
            "keyValue": {
              "topLabel": "Responsável",
              "content": personName,
              "icon": "PERSON"
            }
          },
          {
            "textParagraph": {
              "text": action
            }
          },
          {
            "keyValue": {
              "topLabel": "Feito?",
              "content": done,
              "icon": "BOOKMARK"
            }
          }
        ]
      }
    ]
  }
  if (link != undefined && link != '') {
    ret["sections"][0]["widgets"].push({
      "keyValue": {
        "content": 'Abrir',
        "icon": "DESCRIPTION",
        "onClick": {
          "openLink": {
            "url": link
          }
        }
      }
    })
  }
  return ret
}


function buildLastCard(spreadsheetName, spreadsheetFile) {
  return {
    "sections": [
      {
        "widgets": [
          {
            "keyValue": {
              "topLabel": "Gerado por",
              "content": "Avisos recorrentes",
              "bottomLabel": "BOT",
              "icon": "PERSON",
              "onClick": {
                "openLink": {
                  "url": config.projectUrl,
                }
              }
            }
          },
          {
            "keyValue": {
              "topLabel": "Baseado na planilha",
              "content": spreadsheetName,
              "bottomLabel": "BOT",
              "icon": "DESCRIPTION",
              "onClick": {
                "openLink": {
                  "url": spreadsheetFile
                }
              }
            }
          }
        ]
      }
    ]
  }
}

const  sendRetrospectiveResults = () => {
  const ss = SpreadsheetApp.openById(config.retrospective.sheetId)
  SpreadsheetApp.setActiveSpreadsheet(ss);
  let sheet = ss.getSheetByName("Atual");
  const cards = []
  let lastRow = sheet.getLastRow() + 1
  
  let personName = ''
  let date = ''
  let action = ''
  let done = ''
  let link = ''
  for (let currRow = 2; currRow < lastRow; currRow++) {
    action = sheet.getRange(currRow, 1).getValue()
    personName = sheet.getRange(currRow, 2).getValue()
    date = sheet.getRange(currRow, 3).getValue()
    done = sheet.getRange(currRow, 4).getValue()
    link = sheet.getRange(currRow, 5).getValue()
    cards.push(buildCard(personName, date, action, done, link))
  }
  
  cards.push(buildLastCard(ss.getName(), "https://docs.google.com/spreadsheets/d/" + ss.getId()))
  const data = {
    cards
  };

  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  UrlFetchApp.fetch(config.chatbotUrl, options);  


  sheet = ss.getSheetByName("Anotações extras");
  lastRow = sheet.getLastRow() + 1
  let notes = "E pessoas, tem mais essas anotações: \n";
  for (let currRow = 2; currRow < lastRow; currRow++) {
    notes += ` - ${sheet.getRange(currRow, 3).getValue()} *(do ${sheet.getRange(currRow, 1).getValue()} em ${sheet.getRange(currRow, 2).getValue()})*\n`
  }
  
  options.payload = JSON.stringify({text: notes})
  UrlFetchApp.fetch(config.chatbotUrl, options);  
}
