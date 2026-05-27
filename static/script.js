let selectedDisease = "inflammation";
let chart;

function setDrug(name) {
    document.getElementById("smiles").value = name;
}

function selectDisease(disease, el) {
    selectedDisease = disease;

    document.querySelectorAll(".disease").forEach(d => d.classList.remove("selected"));
    el.classList.add("selected");
}

async function runSimulation() {

    let smiles = document.getElementById("smiles").value;

    const res = await fetch("/simulate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({smiles, disease: selectedDisease})
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    animateValue("binding", "bar-binding", data.binding);
    animateValue("pathway", "bar-pathway", data.pathway);
    animateValue("toxicity", "bar-toxicity", data.toxicity);
    animateValue("cellular", "bar-cellular", data.cellular_response);

    drawChart(data.trajectory);
}

function animateValue(id, barId, value) {

    document.getElementById(id).innerText = value + "%";

    let bar = document.getElementById(barId);
    bar.style.width = value + "%";
}

function drawChart(trajectory) {

    const ctx = document.getElementById("chart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: trajectory.map((_, i) => i),
            datasets: [{
                data: trajectory,
                borderColor: "red",
                fill: true
            }]
        }
    });
}