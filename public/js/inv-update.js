const form = document.querySelector("#updateInventoryForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    if (event.target.tagName.toLowerCase() !== "select") {
    updateBtn.removeAttribute("disabled")}
})