<template>
    <div class="q-pa-md">
      <div class="q-gutter-md">
        <q-skeleton bordered width="1000px" height="50px"/>
        <q-separator spaced/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-skeleton bordered width="300px"  height="30px"/>
        <q-separator spaced/>
        <q-skeleton bordered width="400px"  height="40px"/>
      </div>
    </div>
    <div class="q-pa-md">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left" style="width: 450px">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>
  
        <tbody>
          <tr v-for="n in 5" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="35px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="25px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </template>