const API_URL = 'http://localhost/tripsync_api/api'

export async function createBooking(payload) {
  try {
    const res = await fetch(`${API_URL}/booking/create_booking.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok || !json.ok) {
      throw new Error(json.message || 'การจองล้มเหลว')
    }

    return json
  } catch (error) {
    throw error
  }
}