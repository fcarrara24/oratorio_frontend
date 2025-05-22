# Documentazione API

## Autenticazione

### Login
- **URL**: `/api/auth/login`
- **Metodo**: `POST`
- **Autenticazione**: No
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Successo**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "email": "utente@esempio.com",
      "nome": "Mario",
      "cognome": "Rossi",
      "is_admin": false
    }
  }
  ```

### Registrazione
- **URL**: `/api/auth/register`
- **Metodo**: `POST`
- **Autenticazione**: No
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "nome": "string",
    "cognome": "string"
  }
  ```

## Prodotti

### Lista Prodotti
- **URL**: `/api/prodotti`
- **Metodo**: `GET`
- **Query Params**: 
  - `categoria`: Filtra per categoria
  - `search`: Cerca nel nome/descrizione
  - `page`: Paginazione
  - `limit`: Prodotti per pagina

### Dettaglio Prodotto
- **URL**: `/api/prodotti/:id`
- **Metodo**: `GET`

## Carrello

### Aggiungi al Carrello
- **URL**: `/api/carrello/aggiungi`
- **Metodo**: `POST`
- **Autenticazione**: Sì
- **Body**:
  ```json
  {
    "prodotto_id": 1,
    "quantita": 2
  }
  ```

### Visualizza Carrello
- **URL**: `/api/carrello`
- **Metodo**: `GET`
- **Autenticazione**: Sì

## Ordini

### Crea Ordine
- **URL**: `/api/ordini`
- **Metodo**: `POST`
- **Autenticazione**: Sì
- **Body**:
  ```json
  {
    "note": "Consegnare dopo le 18"
  }
  ```

### Lista Ordini (Admin)
- **URL**: `/api/admin/ordini`
- **Metodo**: `GET`
- **Autenticazione**: Sì (solo admin)
- **Query Params**:
  - `stato`: Filtra per stato
  - `utente_id`: Filtra per utente
  - `data_da`: Filtra da data
  - `data_a`: Filtra a data

## Gestione Prodotti (Admin)

### Crea/Modifica Prodotto
- **URL**: `/api/admin/prodotti` (POST) o `/api/admin/prodotti/:id` (PUT)
- **Metodo**: `POST`/`PUT`
- **Autenticazione**: Sì (solo admin)
- **Body**:
  ```json
  {
    "nome": "Prodotto Esempio",
    "descrizione": "Descrizione",
    "prezzo": 9.99,
    "quantita": 100,
    "categoria_id": 1,
    "is_attivo": true
  }
  ```

## Errori

Tutte le API restituiranno errori nel formato:
```json
{
  "error": {
    "code": "CODICE_ERRORE",
    "message": "Messaggio di errore",
    "details": {}
  }
}
```

### Codici di Errore Comuni
- `AUTH_REQUIRED`: Autenticazione richiesta
- `INVALID_CREDENTIALS`: Credenziali non valide
- `PERMISSION_DENIED`: Permessi insufficienti
- `VALIDATION_ERROR`: Errore di validazione dei dati
- `NOT_FOUND`: Risorsa non trovata
- `INTERNAL_ERROR`: Errore interno del server
