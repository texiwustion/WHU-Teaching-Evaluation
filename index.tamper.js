// ==UserScript==
// @name         武汉大学学生自动评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a floating button to execute custom JS on ugsqs.whu.edu.cn
// @author       Texiwustion
// @match        https://ugsqs.whu.edu.cn/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function executeCustomJS() {
        let counter = 0;

        document.querySelectorAll('.controls').forEach(control => {
            const radios = control.querySelectorAll('input[type="radio"]');
            if (counter === 14 && radios[1]) {
                radios[1].checked = true;
            } else if (radios[0]) {
                radios[0].checked = true;
            }
            counter++;
        });

        document.querySelectorAll('[data-yjzb="开放型问题"]').forEach(element => {
            const textarea = element.querySelector('textarea');
            if (textarea) {
                textarea.value += '\nnull';
            }
        });
        //提交
        document.getElementById("pjsubmit").click();
    }


    function createFloatingButton() {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.width='50px';
        button.style.height='50px';
        button.style.right = '20vh';
        button.style.top = '20vh';
        button.style.zIndex = '100000';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#ffffff';
        button.style.border = '3px solid #ccc';
        button.style.cursor = 'move';
        // Add two div elements for the left and right halves of the button
        const leftHalf = document.createElement('div');
        leftHalf.style.width = '50%';
        leftHalf.style.height = '100%';
        leftHalf.style.backgroundColor = 'black';
        leftHalf.style.position = 'absolute';
        leftHalf.style.left = '0';
        leftHalf.style.top = '0';
        button.appendChild(leftHalf);

        const rightHalf = document.createElement('div');
        rightHalf.style.width = '50%';
        rightHalf.style.height = '100%';
        rightHalf.style.backgroundColor = 'white';
        rightHalf.style.position = 'absolute';
        rightHalf.style.right = '0';
        rightHalf.style.top = '0';
        button.appendChild(rightHalf);
        /*button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand">
            <path d="M15 4V2"/>
            <path d="M15 16v-2"/>
            <path d="M8 9h2"/>
            <path d="M20 9h2"/>
            <path d="M17.8 11.8 19 13"/>
            <path d="M15 9h0"/>
            <path d="M17.8 6.2 19 5"/>
            <path d="m3 21 9-9"/>
            <path d="M12.2 6.2 11 5"/>
        </svg>`;
        // Move the SVG to the top layer and center it within the button
        const svg = button.querySelector('svg');
        svg.style.position = 'absolute';
        svg.style.zIndex = '1';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.transform = 'translate(-50%, -50%)';
        svg.style.backgroundColor = 'transparent';*/
        rightHalf.addEventListener('click', executeCustomJS);
        //changeCursor
        let moved = false;
        let checkCursor = true;

        button.addEventListener('mousemove', function(event) {
            //防止移动过程中变换
            if (!checkCursor) {
                return
            }
            const rect = button.getBoundingClientRect();
            const halfWidth = rect.width / 2;
            const mouseX = event.clientX - rect.left;

            if (mouseX < halfWidth) {
                button.style.cursor = 'move';
                moved = true;
            } else {
                button.style.cursor = 'default';
                moved = false;
            }
        });
        document.body.appendChild(button);

        // Make the button draggable
        button.onmousedown = function(event) {
            // Change position to absolute
            button.style.position = 'absolute';
            let shiftX = event.clientX - button.getBoundingClientRect().left;
            let shiftY = event.clientY - button.getBoundingClientRect().top;
            //console.log(shiftX, shiftY);

            function moveAt(pageX, pageY) {
                button.style.cursor = 'move';
                button.style.left = pageX - shiftX + 'px';
                button.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                if (moved) {
                    moveAt(event.pageX, event.pageY);
                    checkCursor = false;
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            button.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                button.onmouseup = null;
                // Change position back to fixed
                button.style.position = 'fixed';
                //checkCursor
                checkCursor = true;
            };
        };

        button.ondragstart = function() {
            return false;
        };
    }
    createFloatingButton();
})();