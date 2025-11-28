var tl = gsap.timeline({scrollTrigger:{
    trigger: ".two",
    start: "0% 95%",
    end: "70% 50%",
    scrub: true,
    // markers: true,
}})

tl.to("#hero-candle",{
    top: "120%",
    left: "5%",
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0
}, 'orange')
tl.to("#dried-orange",{
    top:"160%",
    left: "23%"
}, 'orange')
tl.to("#lavender",{
    width: "10%",
    top:"160%",
    right: "10%"
}, 'orange')
tl.to("#flower-petal",{
    top:"110%",
    rotate: "130deg",
    left: "70%"
}, 'orange')
tl.to("#flower-petal2",{
    top:"110%",
    rotate: "130deg",
    left: "0%"
}, 'orange')


var tl2 = gsap.timeline({scrollTrigger:{
    trigger: ".three",
    start: "0% 95%",
    end: "20% 50%",
    scrub: true,
    // markers: true,
}})

tl2.from(".petal1",{
    rotate: "-90deg",
    left: "-100%",
    top: "110%"
}, 'ca')
tl2.from("#diffuser",{
    rotate: "-90deg",
    top: "110%",
    left: "-100%",
}, 'ca')

tl2.from(".petal2",{
  
  
}, 'ca')
tl2.from("#hamper",{
  
   
}, 'ca')

tl2.to("#dried-orange",{
    width:"10%",
    left: "42%",
    top: "204%"
}, 'ca')
tl2.to("#hero-candle",{
    width:"15%",
    top: "222%",
    left: "42%",
}, 'ca')

