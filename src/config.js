export default {
	"creative": {
		"language": {
			"en": {
				"type": "image",
				"url": "./img/mc.jpg"
			},
			"jp": {
				"type": "image",
        "url": "./img/mc.jpg"
			},
			"Other": {
				"type": "image",
        "url": "./img/mc.jpg"
			}
		}
	},
	"headline": {
		"language": {
			"en": {
				"city": {
					"Belfast": {
						"weather&&day": { // attention here!
							"Rainy&&Monday": "What a bad rainy monday",
							"Sunny&&Friday": "sunny tgif",
							"ANY&&Saturday": "weekend",
							"ANY&&Sunday": "weekend",
							"Other": "other"
						}
					},
					"Other": ["random1", "random2", "random3"]
				}
			},
			"jp": "マクドナルド",
			"Other": "McDonald"
		}
	},
	"description": "It's {{day}}! THIS will always be english",
	"cta": {
		"os": {
			"iOS": {
				"text": "20% discount for Apple lovers!",
				"url": "tel:00000"
			},
			"Other": {
				"device&&weather": {
					"Mobile&&Raining": {
						"text": "Call Us Now",
						"url": "tel:1300300300"
					},
					"Other": {
						"text": "Order Now",
						"url": "https://www.mcdonalds.com/us/en-us/mcdelivery.html"
					}
				}
			}
		}
	}
}