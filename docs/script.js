function calcularCoste() {
  var kmIda = parseFloat(document.getElementById('kmIda').value) || 0;
  var peajesIda = parseFloat(document.getElementById('peajesIda').value) || 0;
  var tiempoEspera = parseFloat(document.getElementById('tiempoEspera').value) || 0;
  var recogidaAero = document.getElementById('recogidaAero').checked;
  var recogidaSants = document.getElementById('recogidaSants').checked;
  var sietePlazas = document.getElementById('sietePlazas').checked;

  if (
    kmIda === 0 &&
    peajesIda === 0 &&
    tiempoEspera === 0 &&
    !recogidaAero &&
    !recogidaSants &&
    !sietePlazas
  ) {
    document.getElementById('result').innerHTML = "";
    return;
  }

  var costeKm = 0;
  var restante = kmIda;

  if (restante > 0) { var t = Math.min(restante, 50); costeKm += t * 1.96; restante -= t; }
  if (restante > 0) { var t = Math.min(restante, 30); costeKm += t * 1.78; restante -= t; }
  if (restante > 0) { var t = Math.min(restante, 40); costeKm += t * 1.7; restante -= t; }
  if (restante > 0) { var t = Math.min(restante, 80); costeKm += t * 1.6; restante -= t; }
  if (restante > 0) costeKm += restante * 1.45;

  var total =
    costeKm +
    peajesIda * 2 +
    tiempoEspera * 0.46 +
    (recogidaAero ? 15 : 0) +
    (recogidaSants ? 10 : 0) +
    (sietePlazas ? 7 : 0);

  document.getElementById('result').innerHTML = `
    <div class="total">Total: ${total.toFixed(2)} €</div>
    <div class="breakdown">
      Kilometraje: ${costeKm.toFixed(2)} €<br>
      Peajes: ${(peajesIda * 2).toFixed(2)} €<br>
      Espera: ${(tiempoEspera * 0.46).toFixed(2)} €<br>
      Aeropuerto: ${(recogidaAero ? 15 : 0).toFixed(2)} €<br>
      Sants: ${(recogidaSants ? 10 : 0).toFixed(2)} €<br>
      7 plazas: ${(sietePlazas ? 7 : 0).toFixed(2)} €
    </div>`;
}