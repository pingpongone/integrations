(function(config) {
    let statusPagePath = undefined
    let closeButtonColor = undefined
    const key = "closeButtonColor"
    const mobile = screen.width < 450

    const createCloseButton = function() {
        const closeBtn = document.createElement("div")
        closeBtn.setAttribute("style", "position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; cursor: pointer")
        closeBtn.setAttribute("title", "Close notification")

        const namespaceURI = "http://www.w3.org/2000/svg"
        const svgElement = document.createElementNS(namespaceURI, "svg")
        svgElement.setAttribute("style", "width: 30px; height: 30px; color: ".concat(closeButtonColor))
        svgElement.setAttribute("viewBox", "0 0 16 16")
        svgElement.setAttribute("fill", "currentColor")
        const svgPath = document.createElementNS(namespaceURI, "path")
        svgPath.setAttribute("d", "M4.6 4.6a.5.5 0 01.8 0L8 7.3l2.6-2.7a.5.5 0 01.8.8L8.7 8l2.7 2.6a.5.5 0 01-.8.8L8 8.7l-2.6 2.7a.5.5 0 01-.8-.8L7.3 8 4.6 5.4a.5.5 0 010-.8z")
        svgElement.appendChild(svgPath)
        closeBtn.appendChild(svgElement)

        return closeBtn
    }

    const parseData = function(data) {
        if (data["show"] !== true) {
            return
        }

        const container = document.createElement("div")
        container.setAttribute("id", "pingpongWidget")
        container.setAttribute("style", "opacity: 0; visibility: hidden; display: none; position: absolute")
        document.body.prepend(container)

        const iframe = document.createElement("iframe")
        iframe.name = "pingpong-widget"
        iframe.src = statusPagePath
        iframe.width = mobile ? "100%" : "350"
        iframe.height = "180"
        iframe.scrolling = "no"
        iframe.style.transition = 'left 1s ease, bottom 1s ease, right 1s ease'
        iframe.setAttribute("style", "border:none; overflow:hidden")

        container.append(iframe)

        iframe.addEventListener("load", function() {
            const closeBtn = createCloseButton()
            closeBtn.addEventListener("click", function() {
                container.remove()
            })
            container.appendChild(closeBtn)
            if (mobile) {
                container.setAttribute("style", "position: fixed; left:0; right:0; bottom: 0; z-index:99999")
            }
            else {
                container.setAttribute("style", "border-radius: 6px; overflow: hidden; box-shadow: 0px 15px 40px -5px rgba(0,0,0,0.3); position: fixed; left: 25px; bottom: 25px; z-index:99999")
            }
        })
    }

    const widgetInit = function(domain) {
        const url = domain.concat("check/?=_", Date.now())
        const request = new XMLHttpRequest()

        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                parseData(JSON.parse(request.responseText))
            }
        }

        request.open("GET", url, true)
        request.send()
    }

    const prepDomain = function(domain) {
        if (domain.slice(-1) !== "/") {
            domain += "/"
        }
        domain += "embedded/"
        return domain
    }

    if (typeof(config === "object") && "url" in config && config["url"] !== "") {
        statusPagePath = prepDomain(config["url"])
        closeButtonColor = (key in config && config[key] && config[key] !== "") ? config[key] : "#fff"
        widgetInit(statusPagePath)
    }
})(window.PINGPONG_CONFIG)
