
url : URL of the page to mine
[object]

object
- context : absolute jquery selector
 - attribute:
  - name : string
  - selector : jquery selector relative to the parent object selector

## Single Property Definition

```
{
  "title" : {
    "selector" : "body > div.post > h1",
    "value" : "[text]" // "html", "@attributeName"
  },
  "paragraphs" : {
    "selector" : "body > div.post > p",
    "value" : "[text]" // "html", "@attributeName"
  }
}
```

```
{
  "propName1" : "value",
  "propName2" : ["value1", "value2", "value3", ...]
  "propName3" : ["<p>value1</p>", ...]
  "propName3" : ["http://host/path/page.html", ...]
}
```

## Object


```
{
  "propName1" : {
    "@object" : {
      "propName2" : {
        "selector" : "p", // $('p')
        "value" : "text"
      }
    }
  }
}
```

```
{
  "propName1" : {
    propName2 : "text value"
  }
}
```
