import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  blue: '#378ADD',
  green: '#3FB950',
  greenBg: '#122119',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  overlay: 'rgba(13,17,23,0.55)',
};

const BASE = 'https://raw.githubusercontent.com/jonkeegan/us-license-plates/main/plates';

const STATES = [
  { abbr: 'AK', name: 'Alaska',        img: `${BASE}/AK/AK-In-God-We-Trust.png` },
  { abbr: 'AL', name: 'Alabama',        img: `${BASE}/AL/2022-passenger-sample-image-scaled.jpg` },
  { abbr: 'AR', name: 'Arkansas',       img: `${BASE}/AR/123_11.jpg` },
  { abbr: 'AZ', name: 'Arizona',        img: `${BASE}/AZ/license-plate-luke-af-base.jpg` },
  { abbr: 'CA', name: 'California',     img: `${BASE}/CA/IRPbaseplt.gif` },
  { abbr: 'CO', name: 'Colorado',       img: `${BASE}/CO/5_year_collector_passenger.gif.jpg` },
  { abbr: 'CT', name: 'Connecticut',    img: `${BASE}/CT/FOP.gif` },
  { abbr: 'DC', name: 'Washington D.C.',img: `${BASE}/DC/Caps%20Tag%203%20-%202018-sc.jpg.png` },
  { abbr: 'DE', name: 'Delaware',       img: `${BASE}/DE/standardbred_owners_assn.jpg` },
  { abbr: 'FL', name: 'Florida',        img: `${BASE}/FL/motorcycle-standard.png` },
  { abbr: 'GA', name: 'Georgia',        img: `${BASE}/GA/9AK_Large.jpg` },
  { abbr: 'HI', name: 'Hawaii',         img: `${BASE}/HI/standard-plate.jpg` },
  { abbr: 'IA', name: 'Iowa',           img: `${BASE}/IA/AgLit-small.gif` },
  { abbr: 'ID', name: 'Idaho',          img: `${BASE}/ID/ARMY.png` },
  { abbr: 'IL', name: 'Illinois',       img: `${BASE}/IL/passengervanity.gif` },
  { abbr: 'IN', name: 'Indiana',        img: `${BASE}/IN/500_Festival.jpg` },
  { abbr: 'KS', name: 'Kansas',         img: `${BASE}/KS/KS-plates_image-001.jpg` },
  { abbr: 'KY', name: 'Kentucky',       img: `${BASE}/KY/Standard_Motorcycle.png` },
  { abbr: 'LA', name: 'Louisiana',      img: `${BASE}/LA/4HPLATE.JPG` },
  { abbr: 'MA', name: 'Massachusetts',  img: `${BASE}/MA/MA-plates_image-011.jpg` },
  { abbr: 'MD', name: 'Maryland',       img: `${BASE}/MD/101st-Airborne.gif` },
  { abbr: 'ME', name: 'Maine',          img: `${BASE}/ME/passengerplt.jpg` },
  { abbr: 'MI', name: 'Michigan',       img: `${BASE}/MI/Standard_MacBridge.jpg` },
  { abbr: 'MN', name: 'Minnesota',      img: `${BASE}/MN/MN-plates_image-002.jpg` },
  { abbr: 'MO', name: 'Missouri',       img: `${BASE}/MO/standard.gif` },
  { abbr: 'MS', name: 'Mississippi',    img: `${BASE}/MS/Passenger%20Vanity_jpg.jpg` },
  { abbr: 'MT', name: 'Montana',        img: `${BASE}/MT/Baker-Baseball-Thumbnail.jpg` },
  { abbr: 'NC', name: 'North Carolina', img: `${BASE}/NC/plate_sample_10.jpeg` },
  { abbr: 'ND', name: 'North Dakota',   img: `${BASE}/ND/standard.jpg` },
  { abbr: 'NE', name: 'Nebraska',       img: `${BASE}/NE/AG23_Support%2520Arts%2520PA_0.png` },
  { abbr: 'NH', name: 'New Hampshire',  img: `${BASE}/NH/NH-plates_image-000.jpg` },
  { abbr: 'NJ', name: 'New Jersey',     img: `${BASE}/NJ/Merchant_Marines_Standard.gif` },
  { abbr: 'NM', name: 'New Mexico',     img: `${BASE}/NM/Chile-Capital-Passenger-300-2pt1.jpg` },
  { abbr: 'NV', name: 'Nevada',         img: `${BASE}/NV/1961.png` },
  { abbr: 'NY', name: 'New York',       img: `${BASE}/NY/birthplacebaseball-2018.png` },
  { abbr: 'OH', name: 'Ohio',           img: `${BASE}/OH/si_baseball-all.jpg` },
  { abbr: 'OK', name: 'Oklahoma',       img: `${BASE}/OK/180th%20Infantry.png` },
  { abbr: 'OR', name: 'Oregon',         img: `${BASE}/OR/OR-op_image-000.jpg` },
  { abbr: 'PA', name: 'Pennsylvania',   img: `${BASE}/PA/PA%20Sample%20Standard%20Issue%20Registration%20Plate.jpg` },
  { abbr: 'RI', name: 'Rhode Island',   img: `${BASE}/RI/Ocean%20Passenger.jpg` },
  { abbr: 'SC', name: 'South Carolina', img: `${BASE}/SC/USC-Baseball-National-Champions.png` },
  { abbr: 'SD', name: 'South Dakota',   img: `${BASE}/SD/standard-plate.png` },
  { abbr: 'TN', name: 'Tennessee',      img: `${BASE}/TN/5th%20Special%20Forces%20Group%20-%20Airborne.jpg` },
  { abbr: 'TX', name: 'Texas',          img: `${BASE}/TX/auto.11thcavy.png` },
  { abbr: 'UT', name: 'Utah',           img: `${BASE}/UT/airforce.png` },
  { abbr: 'VA', name: 'Virginia',       img: `${BASE}/VA/173airborne.jpg` },
  { abbr: 'VT', name: 'Vermont',        img: `${BASE}/VT/VT-plates_image-001.jpg` },
  { abbr: 'WA', name: 'Washington',     img: `${BASE}/WA/4Hplate.png` },
  { abbr: 'WI', name: 'Wisconsin',      img: `${BASE}/WI/2017-auto.jpg` },
  { abbr: 'WV', name: 'West Virginia',  img: `${BASE}/WV/Nascar-Regular.jpg` },
  { abbr: 'WY', name: 'Wyoming',        img: `${BASE}/WY/2017%20ALUMNI-1.jpg` },
];

const NUM_COLS = 3;

export default function PlatesScreen() {
  const [spotted, setSpotted] = useState(new Set());

  const toggleSpotted = (abbr) => {
    setSpotted(prev => {
      const next = new Set(prev);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isSpotted = spotted.has(item.abbr);
    return (
      <Pressable
        onPress={() => toggleSpotted(item.abbr)}
        style={[styles.card, isSpotted && styles.cardSpotted]}
      >
        <Image
          source={{ uri: item.img }}
          style={styles.plateImg}
          resizeMode="contain"
        />
        {isSpotted && (
          <View style={styles.checkOverlay}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        )}
        <Text style={[styles.stateAbbr, isSpotted && { color: COLORS.green }]}>
          {item.abbr}
        </Text>
        <Text style={styles.stateName} numberOfLines={1}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <Text style={styles.title}>Plates</Text>
        <Text style={styles.count}>
          {spotted.size} / {STATES.length} spotted
        </Text>
      </View>
      <FlatList
        data={STATES}
        keyExtractor={item => item.abbr}
        numColumns={NUM_COLS}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    padding: 8,
    overflow: 'hidden',
  },
  cardSpotted: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenBg,
  },
  plateImg: {
    width: '100%',
    height: 58,
    marginBottom: 4,
  },
  checkOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  stateAbbr: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  stateName: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
