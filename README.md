# product-service

* GET /Products
** Liefert alle Produkte
** Beispiel: [{"id":1,"album":"Best of 15 Years","interpret":"ABBA","price":1.99},{"id":2,"album":"We are the Champions","interpret":"Queen","price":1.79},{"id":3,"album":"Die Perfekte Welle","interpret":"Juli","price":1.99},{"id":4,"album":"Album1","interpret":"Interpret1","price":1.86}]
* GET /Products/:Id
** Liefert das Produkt mit einer ID
** Beispiel: {"id":1,"album":"Best of 15 Years","interpret":"ABBA","price":1.99}
* POST /Products
** Erstellt ein neues Produkt
** Beispiel: {"album":"Best of 15 Years","interpret":"ABBA","price":1.99}
* PUT /Products/:Id
** Ändert ein Produkt
** {"album":"Best of 20 Years","interpret":"ABBA Mania","price":2.50}
* DELETE /Products/:Id
** Löscht ein Produkt
