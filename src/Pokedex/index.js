import React, { Component } from 'react'
import Pokemons from './Pokemons';

import './Pokedex.scss'
import logo from '../images/logo.png'


const Pokedex = require('pokeapi-js-wrapper');
const option = {
protocol: 'https',
  versionPath: '/api/v2/',
  cache: true,
  timeout: 5 * 1000 // 5s
}
const P = new Pokedex.Pokedex(option);

class PokedexApp extends Component {
    state = {
        loading: true,
        pokemons: ''
    }

    componentDidMount() {
        window.addEventListener('scroll', this.fixedMenu);
    }

    fixedMenu = () => {
        const h1 = document.querySelector('.logo');
        const hHeight = h1.offsetHeight;   
        h1.classList.remove('fixed')

        if (window.scrollY > hHeight) {
            h1.classList.add('fixed')
        }
    }

    render() {
        return (
            <div className="Pokedex">
                <h1 className="logo"><img src={logo} alt="Pokedex" /></h1>
                <Pokemons p={P}/>
            </div>
        )
    }
}
export default PokedexApp;