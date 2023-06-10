export const Manufacturers = [
	'Toyota',
	'Honda',
	'KIA',
	'Suzuki',
	'Hyundai',
	'Tesla',
	'BMW',
	'Audi',
	'Mercedez',
];

export const Colors = [
	'White',
	'Grey',
	'Black',
	'Red',
	'Sky Blue',
	'Yellow',
	'Blue',
];

export const Makes = [
	'2000',
	'2001',
	'2001',
	'2003',
	'2004',
	'2005',
	'2006',
	'2007',
	'2008',
	'2009',
	'2010',
	'2011',
	'2012',
	'2012',
	'2013',
	'2014',
	'2015',
	'2016',
	'2017',
	'2018',
	'2019',
	'2020',
	'2021',
];

interface CarData {
	[key: string]: {
	  Modals: {
		[key: string]: {
		  Colors: string[];
		};
	  };
	};
  }
  
 export const availableCars: CarData = {
	Toyota: {
	  Modals: {
		Camry: {
		  Colors: ['Red', 'Blue', 'Green'],
		},
		Corolla: {
		  Colors: ['Silver', 'Black', 'White'],
		},
		Yaris: {
		  Colors: ['Yellow', 'Orange', 'Purple'],
		},
	  },
	},
	Honda: {
	  Modals: {
		Civic: {
		  Colors: ['Red', 'Blue', 'Gray'],
		},
		City: {
		  Colors: ['Silver', 'Black', 'White'],
		},
	  },
	},
	Hyundai: {
	  Modals: {
		Sonata: {
		  Colors: ['Red', 'Blue', 'White'],
		},
		Tucson: {
		  Colors: ['Silver', 'Black', 'Gray'],
		},
	  },
	},
  };