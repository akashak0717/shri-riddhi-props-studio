export const studio = {

  name: "Shri Riddhi Prop's Studio",

  shortName: "SRF",

  instagramUrl:
    "https://instagram.com/shri_riddhi_props_studio",

  whatsappNumber:
    "919731604959",

  whatsappMessage:
    "Hi Shri Riddhi Prop's Studio, I would like to enquire about a shoot.",

  phone:
    "+91 97316 04959",

  email:
    "vishwabandikeri@gmail.com",

  location:
    "Shri Riddhi Prop's Studio",

  locationUrl:
    "https://maps.app.goo.gl/Bk3wcvowBob9pGaq5?g_st=iw"
}


export const whatsappUrl = () =>
  `https://wa.me/${studio.whatsappNumber}?text=${encodeURIComponent(
    studio.whatsappMessage
  )}`