import re
from pprint import pprint

with open("output", "r") as infile, open("items.csv", "w") as outfile:
	count = 0
	addprice = 0
	addquantity = 0
	itemcount = 0

	outfile.write("Token,Item Name,Description,Category,SKU,Variation Name,Price,Current Quantity Eamon's Art,New Quantity Eamon's Art,Stock Alert Enabled Eamon's Art,Stock Alert Count Eamon's Art\n")

	for line in infile:
		#pprint(line)
		#pprint("---------------------------------------------")
		if count == 0:
			#s = line.split(" ")
			m = re.findall(r"\r(\d+)", line)
			n = re.findall(r"(\w+)z", line)
			#pprint(m)
			#pprint(n)
			#pprint("SKU: " + m[0] + " | Description: " + n[2] + " | Price: " + n[1] + " | Quantity: " + n[0])
			quantity = []
			price = []
			description = []
			
			description = n[2::3]
			quantity = n[::3]
			price = n[1::3]

			addprice = price[-1]
			addquantity = quantity[-1]

			del price[-1]
			del quantity[-1]

			#pprint(m)
			#pprint(description)
			#pprint(quantity)
			#pprint(price)

			for i, j, k, l in zip(m, description, price, quantity):
				outfile.write(",ITEM" + str(itemcount) + "," + j + ",ITEM," + i + ",ITEM," + k + ",," + l + ",,\n")
				itemcount+=1

		else:
			barcodes = re.findall(r"\r(\d+)", line)
			descriptions = re.findall(r"(\w+)z\x1c\x1a\x07", line)
			
			prices = re.findall(r"\x00*\x04\x1a\x02(\d+)", line)
			prices.insert(0, addprice)

			quantities = re.findall(r"(\x05\x1a\x03(\d+)|\x03\x1a\x01(\d+))", line)
			quantities.insert(0, addquantity)


			#pprint(barcodes)
			#pprint(descriptions)
			#pprint(prices)

			tuplecount = 0
			for z in quantities:
				if type(z) is tuple:
					for u in z:
						if u.isdigit():
							quant = u
							quantities[tuplecount] = quant

				tuplecount+=1

			#pprint(quantities)

			for i, j, k, l in zip(barcodes, descriptions, prices, quantities):
				outfile.write(",ITEM" + str(itemcount) + "," + j + ",ITEM," + i + ",ITEM," + k + ",," + l + ",,\n")
				itemcount+=1

		count+=1